import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, SelectInputComponent, TextareaInputComponent, TextInputComponent } from '../../../../../shared/components';
import { Role, UserType } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { UserTypeService } from '../../../services/user-type/user-type.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { RoleService } from '../../../services/role/role.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-user-type',
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, TextareaInputComponent, CheckboxInputComponent, SelectInputComponent],
  templateUrl: './user-type.page.html',
  styleUrl: './user-type.page.scss'
})
export class UserTypePage {
  userTypeForm: FormGroup;

  allUserTypes: UserType[] = [];
  allRoles: Role[] = [];
  userTypesToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddUserType : boolean = false; 
  isEditUserType : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Descripción','Estado'];

  constructor(
      private formGroup : FormBuilder,
      private changeDetectorRef : ChangeDetectorRef,
      private userTypeService: UserTypeService,
      private messageService : MessageService,
      private roleService: RoleService
  ) {
     this.userTypeForm = this.formGroup.group({
      userTypeCode: [{value: '', disabled : false}, [
        Validators.required,
        Validators.maxLength(10),
        noWhitespaceValidator
      ]],
      name: ['', [
        Validators.required,
        Validators.maxLength(25),
        noWhitespaceValidator
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
      isActive: [{value: true }],
      roleCode: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.getAllUserTypes();
    this.allRoles = (await this.getAllRoles()).filter(role => role.isActive);
  }


  async getAllUserTypes(){
    try {
      this.isLoading = true;
      this.allUserTypes = await this.userTypeService.getAllUserType();
      this.userTypesToView = this.userTypeService.transformAndReorder(this.allUserTypes);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allUserTypes = [];
    }
  }

  async addUserType() {
      this.isAddUserType = true;
  }

  async editUserType(object : TransformObject){
    
    try {
      let userType = await this.userTypeService.getUserTypeByCode(object['id']);

      this.userTypeForm.setValue({
        userTypeCode: userType?.userTypeCode,
        roleCode: userType?.role?.roleCode || '',
        name: userType?.name || '',
        description: userType?.description || '',
        isActive: userType?.isActive
      });

      // se desactiva la opción de editar el campo código de tipo de usuario
      this.userTypeForm.get('userTypeCode')?.disable();
      this.userTypeForm.get('roleCode')?.disable();
      this.isEditUserType = true;

      this.changeDetectorRef.detectChanges();
    } catch(err) {

    }

  }

  async deleteUserType(object : TransformObject){
    try {
      this.isLoading = true;
      await this.userTypeService.deleteUserType(object['id']);
      this.messageService.showSuccess("Tipo de ususario eliminado con éxito.","Tipo de usuario");
      await this.getAllUserTypes();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userTypeForm.valid) {
      try {
        this.isLoading = true;
        this.userTypeForm.value.userTypeCode = String(this.userTypeForm.value.userTypeCode).toUpperCase();
  
        if(this.isAddUserType) {
          await this.userTypeService.createUserType(this.userTypeForm.value);
          this.messageService.showSuccess("Tipo de usuario agregado con éxito.","Tipo de usuario");
        } else {
           this.userTypeForm.get('userTypeCode')?.enable();
           this.userTypeForm.get('roleCode')?.enable();
           await this.userTypeService.updateUserType(this.userTypeForm.value['userTypeCode'],this.userTypeForm.value);
           this.messageService.showSuccess("Tipo de usuario actualizado con éxito.","Tipo de usuario");
        }
        
        this.isLoading = false;
        await this.getAllUserTypes();
        this.cleanValuesOfForm();
        this.isAddUserType = false;
        this.isEditUserType = false;
      } catch(err) {
        if (this.isEditUserType) {
          this.userTypeForm.get('userTypeCode')?.disable();
          this.userTypeForm.get('roleCode')?.disable();
        }
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.userTypeForm);
    }
  }

  onCancel(): void {
    this.isAddUserType = false;
    this.isEditUserType = false;
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

  get descriptionLength(): number {
    return this.userTypeForm.get('description')?.value?.length || 0;
  }

  get descriptionMaxLength(): number {
    return 50;
  }

  get descriptionLengthClass(): string {
    const length = this.descriptionLength;
    const max = this.descriptionMaxLength;
    
    if (length > max) {
      return 'text-red-600 font-semibold';
    } else if (length > max * 0.8) {
      return 'text-yellow-600';
    }
    return 'text-gray-500';
  }

  cleanValuesOfForm(){
    this.userTypeForm.reset({
      roleCode: ''
    });
    this.userTypeForm.get('userTypeCode')?.enable();
    this.userTypeForm.get('roleCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.userTypeForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddUserType) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }

  async getAllRoles() : Promise<Role[]> {
    try{
      return await this.roleService.getAllRoles();
    } catch(err){
      return [];
    }
  }
}
