import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectInputComponent, TextareaInputComponent, TextInputComponent } from '../../../../shared/components';
import { IncidentTypeService } from '../../../admin/services/incident-type/incident-type.service';
import { IncidentPriorityLevelService } from '../../../admin/services/incident-priority-level/incident-priority-level.service';
import { Equipment, EquipmentLocation, IncidentPriorityLevel, IncidentType } from '../../../../shared/interfaces/models';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from '../../../../shared/utils/common-functions';
import { EquipmentService } from '../../../admin/services/equipment/equipment.service';
import { EquipmentLocationService } from '../../../admin/services/equipment-location/equipment-location.service';
import { ReporterIncidentService } from '../../services/reporter-incident/reporter-incident.service';
import { MessageService } from '../../../../shared/services/message-service/message.service';

@Component({
  selector: 'app-reporter-add-incident',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    TextareaInputComponent
  ],
  templateUrl: './add-incident.page.html',
  styleUrl: './add-incident.page.scss'
})
export class AddIncidentPage {
  incidentForm: FormGroup;
  incidentTypes: IncidentType[] = [];
  incidentPriorityLevels: IncidentPriorityLevel[] = [];
  equipments: Equipment[] = [];
  equipmentLocations: EquipmentLocation[] = [];
  
  constructor(
     private formGroup : FormBuilder,
     private incidentTypeService: IncidentTypeService,
     private incidentPriorityLevelService: IncidentPriorityLevelService,
     private equipmentService: EquipmentService,
     private equipmentLocationService: EquipmentLocationService,
     private router : Router,
     private reporterIncidentService: ReporterIncidentService,
     private messageService: MessageService
  ){
     this.incidentForm = this.formGroup.group({
      incidentTypeCode: ['', Validators.required],
      incidentPriorityLevelCode: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.maxLength(50),
        noWhitespaceValidator,
      ]],
      details: this.formGroup.array([])
    });
  }

  // Getter para acceder fácilmente al FormArray
  get detailsArray(): FormArray {
    return this.incidentForm.get('details') as FormArray;
  }

  // Crear un nuevo grupo de detalle
  createDetailGroup(): FormGroup {
    return this.formGroup.group({
      description: ['', [Validators.required, noWhitespaceValidator]],
      equipmentId: ['', Validators.required],
      equipmentLocationId: ['', Validators.required]
    });
  }

  async ngOnInit(){
    try {
      this.incidentTypes = (await this.getAllIncidentTypes()).filter(incidentType => incidentType.isActive);
      this.incidentPriorityLevels = (await this.getAllIncidentPriorityLevel()).filter(incidentPriorityLevel => incidentPriorityLevel.isActive);
      this.equipments = (await this.equipmentService.getAllEquipment()).filter(equipment => equipment.isActive);
      this.equipmentLocations = (await this.equipmentLocationService.getAllLocation()).filter(location => location.isActive);

      this.addDetail();
    } catch(err){

    }
  }

  onCancel(): void {
    this.cleanValuesOfForm();
    this.router.navigate(["reporter"]);
  }

  async getAllIncidentTypes() : Promise<IncidentType[]> {
    try {
      return await this.incidentTypeService.getAllIncidentTypes();
    } catch (err) {
      return [];
    }
  }

  async getAllIncidentPriorityLevel() : Promise<IncidentPriorityLevel[]> {
    try {
      return await this.incidentPriorityLevelService.getAllIncidentPriorityLevels();
    } catch (err) {
      return [];
    }
  }

   private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  get descriptionLength(): number {
    return this.incidentForm.get('description')?.value?.length || 0;
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
    this.incidentForm.reset({});
    // Limpiar el array de detalles
    while (this.detailsArray.length !== 0) {
      this.detailsArray.removeAt(0);
    }
    // Agregar un detalle vacío después de limpiar
    this.addDetail();
  }

  async onSubmit(): Promise<void> {
    if (this.incidentForm.valid) {
      try {

        await this.reporterIncidentService.addIncident(this.incidentForm.value);
        this.messageService.showSuccess("Incidente agregado con éxito.","Incidente");
        this.router.navigate(["reporter"]);
      } catch(err) {
        
      }
    } else {
      this.markFormGroupTouched(this.incidentForm);
    }
  }

  // Agregar nuevo detalle
  addDetail(): void {
    this.detailsArray.push(this.createDetailGroup());
  }

  // Eliminar detalle
  removeDetail(index: number): void {
    this.detailsArray.removeAt(index);
  }
}
