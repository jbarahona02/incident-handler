import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, TextareaInputComponent, TextInputComponent } from '../../../../../shared/components';
import { IncidentPriorityLevel } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { IncidentPriorityLevelService } from '../../../services/incident-priority-level/incident-priority-level.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';

@Component({
  selector: 'app-incident-priority-level',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DataTableComponent, 
    TextInputComponent, 
    TextareaInputComponent,
    CheckboxInputComponent
  ],
  templateUrl: './incident-priority-level.page.html',
  styleUrl: './incident-priority-level.page.scss'
})
export class IncidentPriorityLevelPage {
  incidentPriorityLevelForm: FormGroup;

  allIncidentPriorityLevel: IncidentPriorityLevel[] = [];
  incidentPriorityLevelsToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddIncidentPriorityLevel : boolean = false; 
  isEditIncidentPriorityLevel : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Descripción','Estado'];

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private incidentPriorityLevelService: IncidentPriorityLevelService,
    private messageService : MessageService
  ){
     this.incidentPriorityLevelForm = this.formGroup.group({
      incidentPriorityLevelCode: [{
        value: '', disabled: false
      }, [
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
      ]],
      isActive: [{value: true}]
    });
  }

  async ngOnInit() {
    await this.getAllIncidentPriorityLevels();
  }

  async getAllIncidentPriorityLevels(){
    try {
      this.isLoading = true;
      this.allIncidentPriorityLevel = await this.incidentPriorityLevelService.getAllIncidentPriorityLevels();
      this.incidentPriorityLevelsToView = this.incidentPriorityLevelService.transformAndReorder(this.allIncidentPriorityLevel);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allIncidentPriorityLevel = [];
    }
  }

  async addIncidentPriorityLevel() {
      this.isAddIncidentPriorityLevel = true;
  }

  async editIncidentPriorityLevel(object : TransformObject){
    let incidentPriorityLevel = this.allIncidentPriorityLevel.find(incidentPrioriryLevel => incidentPrioriryLevel.incidentPriorityLevelCode == object['id']);

    this.incidentPriorityLevelForm.setValue({
      incidentPriorityLevelCode: incidentPriorityLevel?.incidentPriorityLevelCode || '',
      name: incidentPriorityLevel?.name || '',
      description: incidentPriorityLevel?.description || '',
      isActive: incidentPriorityLevel?.isActive
    });

    this.incidentPriorityLevelForm.get('incidentPriorityLevelCode')?.disable();

    this.isEditIncidentPriorityLevel = true;

  }

  async deleteIncidentPriorityLevel(object : TransformObject){
    try {
      this.isLoading = true;
      await this.incidentPriorityLevelService.deleteIncidentPriorityLevel(object['id']);
      this.messageService.showSuccess("Nivel de prioridad eliminado con éxito.","Incidente").subscribe();
      await this.getAllIncidentPriorityLevels();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.incidentPriorityLevelForm.valid) {
      try {
        this.isLoading = true;
        this.incidentPriorityLevelForm.value.incidentPriorityLevelCode = String(this.incidentPriorityLevelForm.value.incidentPriorityLevelCode).toUpperCase();
        
        if(this.isAddIncidentPriorityLevel) {
          await this.incidentPriorityLevelService.createIncidentPriorityLevel(this.incidentPriorityLevelForm.value);
          this.messageService.showSuccess("Nivel de prioridad agregado con éxito.","Incidente").subscribe();
        } else {
           this.incidentPriorityLevelForm.get('incidentPriorityLevelCode')?.enable();
           await this.incidentPriorityLevelService.updateIncidentPriorityLevel(this.incidentPriorityLevelForm.value['incidentPriorityLevelCode'],this.incidentPriorityLevelForm.value);
           this.messageService.showSuccess("Nivel de prioridad actualizado con éxito.","Incidente").subscribe();
        }
        
        this.isLoading = false;
        await this.getAllIncidentPriorityLevels();
        this.cleanValuesOfForm();
        this.isAddIncidentPriorityLevel = false;
        this.isEditIncidentPriorityLevel = false;
      } catch(err) {
        if(this.isEditIncidentPriorityLevel) this.incidentPriorityLevelForm.get('incidentPriorityLevelCode')?.disable();
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.incidentPriorityLevelForm);
    }
  }

  onCancel(): void {
    this.isAddIncidentPriorityLevel = false;
    this.isEditIncidentPriorityLevel = false;
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
    return this.incidentPriorityLevelForm.get('description')?.value?.length || 0;
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
    this.incidentPriorityLevelForm.reset({});
    this.incidentPriorityLevelForm.get('incidentPriorityLevelCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.incidentPriorityLevelForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddIncidentPriorityLevel) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
