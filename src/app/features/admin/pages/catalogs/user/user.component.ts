import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, SelectInputComponent, TextInputComponent } from '../../../../../shared/components';
import { UserApp, UserType } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { UserTypeService } from '../../../services/user-type/user-type.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { UserService } from '../../../services/user/user.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, SelectInputComponent, CheckboxInputComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserPage {
  userForm: FormGroup;

  allUsers: UserApp[] = [];
  allUserTypes: UserType[] = [];
  usersToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddUser : boolean = false; 
  isEditUser : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Correo','Estado'];

  userID : number = 0;

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private userTypeService: UserTypeService,
    private userService : UserService,
    private messageService : MessageService,
  ) {
    this.userForm = this.formGroup.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(25),
        noWhitespaceValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        noWhitespaceValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(75),
        noWhitespaceValidator
      ]],
      userTypeCode: ['', Validators.required],
      isActive: [{value: true }],
    });
  }

  async ngOnInit() {
    await this.getAllUsers();
    this.allUserTypes = (await this.getAllUserTypes()).filter(userType => userType.isActive);
  }

  async getAllUsers(){
    try {
      this.isLoading = true;
      this.allUsers = await this.userService.getAllUsers(),
      this.usersToView = this.userService.transformAndReorder(this.allUsers);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allUserTypes = [];
    }
  }

  async getAllUserTypes() : Promise<UserType[]> {
    try{
      return await this.userTypeService.getAllUserType();
    } catch(err){
      return [];
    }
  }
  
  async addUser(){
    this.isAddUser = true;
  }

  async editUser(object : TransformObject){
    try {
      let user: UserApp = await this.userService.getUserTypeByEmail(object['email']);
      this.userID = user.userAppId;
      this.userForm.setValue({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '123',
        isActive: user?.isActive,
        userTypeCode: user?.userType?.userTypeCode || ''
      });

      // se desactiva la opción de editar el campo código de tipo de usuario
      this.userForm.get('userTypeCode')?.disable();
      this.userForm.get('password')?.disable();
      this.isEditUser = true;
      this.changeDetectorRef.detectChanges();
    } catch(err) {

    }
  }

  async deleteUser(object : TransformObject){

  }

  async onSubmit(){
    if (this.userForm.valid) {
      try {
        this.isLoading = true;
  
        if(this.isAddUser) {
          await this.userService.createUser (this.userForm.value);
          this.messageService.showSuccess("Usuario agregado con éxito.","Usuario");
        } else {
           this.userForm.get('userTypeCode')?.enable();
           this.userForm.get('password')?.enable();
           await this.userService.updateUser(this.userID,this.userForm.value);
           this.messageService.showSuccess("Usuario actualizado con éxito.","Usuario");
        }
        
        this.isLoading = false;
        await this.getAllUsers();
        this.cleanValuesOfForm();
        this.isAddUser = false;
        this.isEditUser = false;
      } catch(err) {
        if (this.isEditUser) {
          this.userForm.get('userTypeCode')?.disable();
          this.userForm.get('password')?.disable();
        }
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  onCancel(): void {
    this.isAddUser = false;
    this.isEditUser = false;
    this.cleanValuesOfForm();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cleanValuesOfForm(){
    this.userForm.reset({
      userTypeCode: ''
    });
    this.userForm.get('userTypeCode')?.enable();
    this.userForm.get('password')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.userForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddUser) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
