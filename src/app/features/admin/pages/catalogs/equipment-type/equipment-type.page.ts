import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipmentType } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { EquipmentTypeService } from '../../../services/equipment-type/equipment-type.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent, DataTableComponent, TextareaInputComponent, TextInputComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-equipment-type',
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, TextareaInputComponent, CheckboxInputComponent],
  templateUrl: './equipment-type.page.html',
  styleUrl: './equipment-type.page.scss'
})
export class EquipmentTypePage {
  equipmentTypeForm: FormGroup;

  allEquipmentType: EquipmentType[] = [];
  equipmentTypeToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddEquipmentType : boolean = false; 
  isEditEquipmentType : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['id','Nombre','Descripción','Estado'];

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private equipmentTypeService: EquipmentTypeService,
    private messageService : MessageService,
  ){
     this.equipmentTypeForm = this.formGroup.group({
      equipmentTypeCode: ['', [
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
    await this.getAllEquipmentType();
  }

  async getAllEquipmentType(){
    try {
      this.isLoading = true;
      this.allEquipmentType = await this.equipmentTypeService.getAllEquipmentType();
      this.equipmentTypeToView = this.equipmentTypeService.transformAndReorder(this.allEquipmentType);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allEquipmentType = [];
    }
  }

  async addEquipmentType() {
      this.isAddEquipmentType = true;
  }

  async editEquipmentType(object : TransformObject){
    let equipmentType = this.allEquipmentType.find(equipmentType => equipmentType.equipmentTypeCode == object['id']);

    this.equipmentTypeForm.setValue({
      equipmentTypeCode: equipmentType?.equipmentTypeCode || '',
      name: equipmentType?.name || '',
      description: equipmentType?.description || '',
      isActive: equipmentType?.isActive
    });

    this.equipmentTypeForm.get('equipmentTypeCode')?.disable();

    this.isEditEquipmentType = true;

  }

  async deleteEquipmentType(object : TransformObject){
    try {
      this.isLoading = true;
      await this.equipmentTypeService.deleteEquipmentType(object['id']);
      this.messageService.showSuccess("Tipo de equipo eliminado con éxito.","Tipo de equipo").subscribe();
      await this.getAllEquipmentType();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.equipmentTypeForm.valid) {
      try {
        this.isLoading = true;
        this.equipmentTypeForm.value.equipmentTypeCode = String(this.equipmentTypeForm.value.equipmentTypeCode).toUpperCase();
        
        if(this.isAddEquipmentType) {
          await this.equipmentTypeService.createEquipmentType(this.equipmentTypeForm.value);
          this.messageService.showSuccess("Tipo de equipo agregado con éxito.","Tipo de equipo").subscribe();
        } else {
           this.equipmentTypeForm.get('equipmentTypeCode')?.enable();
           await this.equipmentTypeService.updateEquipmentType(this.equipmentTypeForm.value['equipmentTypeCode'],this.equipmentTypeForm.value);
           this.messageService.showSuccess("Tipo de equipo actualizado con éxito.","Tipo de equipo").subscribe();
        }
        
        this.isLoading = false;
        await this.getAllEquipmentType();
        this.cleanValuesOfForm();
        this.isAddEquipmentType = false;
        this.isEditEquipmentType = false;
      } catch(err) {
        if(this.isEditEquipmentType) this.equipmentTypeForm.get('equipmentTypeCode')?.disable();
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.equipmentTypeForm);
    }
  }

  onCancel(): void {
    this.isAddEquipmentType = false;
    this.isEditEquipmentType = false;
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
    return this.equipmentTypeForm.get('description')?.value?.length || 0;
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
    this.equipmentTypeForm.reset({});
    this.equipmentTypeForm.get('equipmentTypeCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.equipmentTypeForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddEquipmentType) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
