import { ChangeDetectorRef, Component } from '@angular/core';
import { Role } from '../../../../../shared/interfaces/models';
import { RoleService } from '../../../services/role/role.service';
import { TransformObject } from '../../../../../shared/interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, TextareaInputComponent, TextInputComponent } from '../../../../../shared/components';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-role',
  imports: [ CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, TextareaInputComponent, CheckboxInputComponent],
  templateUrl: './role.page.html',
  styleUrl: './role.page.scss'
})
export class RolePage {
  roleForm: FormGroup;

  allRoles: Role[] = [];
  rolesToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddRole : boolean = false; 
  isEditRole : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Descripción','Estado'];

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private roleService: RoleService,
    private messageService : MessageService
  ){
     this.roleForm = this.formGroup.group({
      roleCode: [{
        value: '', disabled: false
      }, [
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
      isActive: [{value: true}]
    });
  }

  async ngOnInit() {
    await this.getAllRoles();
  }

  async getAllRoles(){
    try {
      this.isLoading = true;
      this.allRoles = await this.roleService.getAllRoles();
      this.rolesToView = this.roleService.transformAndReorder(this.allRoles);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allRoles = [];
    }
  }

  async addRole() {
      this.isAddRole = true;
  }

  async editRole(object : TransformObject){
    let role = this.allRoles.find(role => role.roleCode == object['id']);

    this.roleForm.setValue({
      roleCode: role?.roleCode || '',
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive
    });

    this.roleForm.get('roleCode')?.disable();

    this.isEditRole = true;

  }

  async deleteRole(object : TransformObject){
    try {
      this.isLoading = true;
      await this.roleService.deleteRole(object['id']);
      this.messageService.showSuccess("Rol eliminado con éxito.","Rol").subscribe();
      await this.getAllRoles();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.roleForm.valid) {
      try {
        this.isLoading = true;
        this.roleForm.value.roleCode = String(this.roleForm.value.roleCode).toUpperCase();
        
        if(this.isAddRole) {
          await this.roleService.createRole(this.roleForm.value);
          this.messageService.showSuccess("Rol agregado con éxito.","Rol").subscribe();
        } else {
           this.roleForm.get('roleCode')?.enable();
           await this.roleService.updateRole(this.roleForm.value['roleCode'],this.roleForm.value);
           this.messageService.showSuccess("Rol actualizado con éxito.","Rol").subscribe();
        }
        
        this.isLoading = false;
        await this.getAllRoles();
        this.cleanValuesOfForm();
        this.isAddRole = false;
        this.isEditRole = false;
      } catch(err) {
        if(this.isEditRole) this.roleForm.get('roleCode')?.disable();
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.roleForm);
    }
  }

  onCancel(): void {
    this.isAddRole = false;
    this.isEditRole = false;
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
    return this.roleForm.get('description')?.value?.length || 0;
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
    this.roleForm.reset({});
    this.roleForm.get('roleCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.roleForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddRole) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
