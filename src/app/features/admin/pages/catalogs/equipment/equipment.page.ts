import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, DateInputComponent, SelectInputComponent, TextInputComponent } from '../../../../../shared/components';
import { Equipment, EquipmentLocation, EquipmentType } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { EquipmentService } from '../../../services/equipment/equipment.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { EquipmentTypeService } from '../../../services/equipment-type/equipment-type.service';
import { EquipmentLocationService } from '../../../services/equipment-location/equipment-location.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-equipment',
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, CheckboxInputComponent, SelectInputComponent, DateInputComponent ],
  templateUrl: './equipment.page.html',
  styleUrl: './equipment.page.scss'
})
export class EquipmentPage {
  equipmentForm: FormGroup;

  allEquipment: Equipment[] = [];
  allEquipmentTypes: EquipmentType[] = [];
  allLocation: EquipmentLocation[] = [];
  equipmentsToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddEquipment : boolean = false; 
  isEditEquipment : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['id','Nombre','Marca','Número de serie','Modelo','Estado'];
  equipmentId : number = 0;

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private equipmentService: EquipmentService,
    private messageService : MessageService,
    private equipmentTypeService : EquipmentTypeService,
    private equipmentLocationService: EquipmentLocationService
  ){
    this.equipmentForm = this.formGroup.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(25),
        noWhitespaceValidator
      ]],
      equipmentTypeCode: ['', Validators.required],
      brand: ['', [
        Validators.required,
        Validators.maxLength(35),
        noWhitespaceValidator
      ]],
      color: ['', [
        Validators.required,
        Validators.maxLength(20),
        noWhitespaceValidator
      ]],
      serialNumber: ['', [
        Validators.required,
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
      model: ['', [
        Validators.required,
        Validators.maxLength(25),
        noWhitespaceValidator
      ]],
      equipmentLocationId: ['', Validators.required],
      warrantyExpiredDate: ['', [
        Validators.required,
      ]],
      isWarrantyExpired: [false],
      isActive: [{value: true}]
    });
  }

  async ngOnInit() {
    await this.getAllEquipment();
    
    try {
      this.allEquipmentTypes = (await this.equipmentTypeService.getAllEquipmentType()).filter(equipment => equipment.isActive);
      this.allLocation = (await this.equipmentLocationService.getAllLocation()).filter(location => location.isActive);
    } catch (err) {

    }

    this.equipmentForm.get('isWarrantyExpired')?.disable();
    this.equipmentForm.get('warrantyExpiredDate')?.valueChanges.subscribe(data =>{
      if(data && (Date.parse(data) <= Date.now())){
        this.equipmentForm.get('isWarrantyExpired')?.setValue(true);
      } else {
        this.equipmentForm.get('isWarrantyExpired')?.setValue(false);
      }
    })
  }

  async getAllEquipment(){
    try {
      this.isLoading = true;
      this.allEquipment = await this.equipmentService.getAllEquipment();
      this.equipmentsToView = this.equipmentService.transformAndReorder(this.allEquipment);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allEquipment = [];
    }
  }

  async addEquipmentType() {
      this.isAddEquipment = true;
  }

  async editEquipment(object : TransformObject){
    let equipment = this.allEquipment.find(equipment => equipment.equipmentId == object['id']);
    this.equipmentId = equipment?.equipmentId ?? 0;
    this.equipmentForm.setValue({
      name: equipment?.name || '',
      equipmentTypeCode: equipment?.equipmentTypeCode || '',
      brand: equipment?.brand || '',
      color: equipment?.color || '',
      serialNumber: equipment?.serialNumber || '',
      model: equipment?.model || '',
      equipmentLocationId: equipment?.equipmentLocationId || '',
      warrantyExpiredDate: String(equipment?.warrantyExpiredDate).split("T")[0] || this.getCurrentDate(),
      isWarrantyExpired: equipment?.isWarrantyExpired || false,
      isActive: equipment?.isActive 
    });

    this.equipmentForm.get('equipmentTypeCode')?.disable();

    this.isEditEquipment = true;

  }

  async deleteEquipment(object : TransformObject){
    try {
      this.isLoading = true;
      await this.equipmentService.deleteEquipment(object['id']);
      this.messageService.showSuccess("Equipo eliminado con éxito.","Equipo");
      await this.getAllEquipment();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.equipmentForm.valid) {
      try {
        this.isLoading = true;
        
        if(this.isAddEquipment) {
          this.equipmentForm.get('isWarrantyExpired')?.enable();
          await this.equipmentService.createEquipment(this.equipmentForm.value);
          this.messageService.showSuccess("Equipo agregado con éxito.","Equipo");
        } else {
           this.equipmentForm.get('isWarrantyExpired')?.enable();
           this.equipmentForm.get('equipmentTypeCode')?.enable();
           await this.equipmentService.updateEquipment(this.equipmentId,this.equipmentForm.value);
           this.messageService.showSuccess("Equipo actualizado con éxito.","Equipo");
        }
        
        this.equipmentForm.get('isWarrantyExpired')?.disable();
        this.isLoading = false;
        await this.getAllEquipment();
        this.cleanValuesOfForm();
        this.isAddEquipment = false;
        this.isEditEquipment = false;
      } catch(err) {
        if(this.isEditEquipment) this.equipmentForm.get('equipmentTypeCode')?.disable();
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.equipmentForm);
    }
  }

  onCancel(): void {
    this.isAddEquipment = false;
    this.isEditEquipment = false;
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

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  cleanValuesOfForm(){
    this.equipmentForm.reset({});
    this.equipmentForm.get('equipmentTypeCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.equipmentForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddEquipment) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
