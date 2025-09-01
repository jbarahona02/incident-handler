import { ChangeDetectorRef, Component } from '@angular/core';
import { Role } from '../../../../../shared/interfaces/models';
import { RoleService } from '../../../services/role/role.service';
import { TransformObject } from '../../../../../shared/interfaces';
import { DataTableComponent } from "../../../../../shared/components/data-table/data-table.component";
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../../../../shared/components/forms/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaInputComponent } from '../../../../../shared/components/forms/textarea-input/textarea-input.component';

@Component({
  selector: 'app-role',
  imports: [ CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, TextareaInputComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  roleForm: FormGroup;

  allRoles: Role[] = [];
  rolesToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddRole : boolean = false; 
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Descripción','Estado'];

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private roleService: RoleService
  ){
     this.roleForm = this.formGroup.group({
      roleCode: ['', [
        Validators.required,
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.maxLength(25)
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]]
    });
  }

  async ngOnInit() {
    await this.getAllRole();
  }

  async getAllRole(){
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
    try {
       this.isAddRole = true;
    } catch (err) {
       this.isAddRole = false;
    }
  }

  async editRole(object : TransformObject){

  }

  async deleteRole(object : TransformObject){

  }

  async onSubmit(): Promise<void> {
    if (this.roleForm.valid) {
      console.log("form: ", this.roleForm.value);
      try {
        this.roleForm.value.roleCode = String(this.roleForm.value.roleCode).toUpperCase();
        await this.roleService.createRole(this.roleForm.value);
      } catch(err) {

      }
    } else {
      this.markFormGroupTouched(this.roleForm);
    }
  }

  onCancel(): void {
    this.isAddRole = false;
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
}
