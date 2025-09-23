import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxInputComponent, DataTableComponent, TextareaInputComponent, TextInputComponent } from '../../../../../shared/components';
import { IncidentType } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { IncidentTypeService } from '../../../services/incident-type/incident-type.service';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-incident-type',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DataTableComponent, 
    TextInputComponent, 
    TextareaInputComponent,
    CheckboxInputComponent
  ],
  templateUrl: './incident-type.page.html',
  styleUrl: './incident-type.page.scss'
})
export class IncidentTypePage {
  incidentTypeForm: FormGroup;

  allIncidentTypes: IncidentType[] = [];
  incidentTypesToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddIncidentType : boolean = false; 
  isEditIncidentType : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['Código','Nombre','Descripción','Estado'];

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private incidentTypeService: IncidentTypeService,
    private messageService : MessageService
  ){
     this.incidentTypeForm = this.formGroup.group({
      incidentTypeCode: [{
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
    await this.getAllIncidentTypes();
  }

  async getAllIncidentTypes(){
    try {
      this.isLoading = true;
      this.allIncidentTypes = await this.incidentTypeService.getAllIncidentTypes();
      this.incidentTypesToView = this.incidentTypeService.transformAndReorder(this.allIncidentTypes);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allIncidentTypes = [];
    }
  }

  async addIncidentType() {
      this.isAddIncidentType = true;
  }

  async editIncidentType(object : TransformObject){
    let incidentType = this.allIncidentTypes.find(incidentType => incidentType.incidentTypeCode == object['id']);

    this.incidentTypeForm.setValue({
      incidentTypeCode: incidentType?.incidentTypeCode || '',
      name: incidentType?.name || '',
      description: incidentType?.description || '',
      isActive: incidentType?.isActive
    });

    this.incidentTypeForm.get('incidentTypeCode')?.disable();

    this.isEditIncidentType = true;

  }

  async deleteIncidentType(object : TransformObject){
    try {
      this.isLoading = true;
      await this.incidentTypeService.deleteIncidentType(object['id']);
      this.messageService.showSuccess("Tipo de incidente eliminado con éxito.","Tipo de incidente").subscribe();
      await this.getAllIncidentTypes();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.incidentTypeForm.valid) {
      try {
        this.isLoading = true;
        this.incidentTypeForm.value.incidentTypeCode = String(this.incidentTypeForm.value.incidentTypeCode).toUpperCase();
        
        if(this.isAddIncidentType) {
          await this.incidentTypeService.createIncidentType(this.incidentTypeForm.value);
          this.messageService.showSuccess("Tipo de incidente agregado con éxito.","Tipo de incidente").subscribe();
        } else {
           this.incidentTypeForm.get('incidentTypeCode')?.enable();
           await this.incidentTypeService.updateIncidentType(this.incidentTypeForm.value['incidentTypeCode'],this.incidentTypeForm.value);
           this.messageService.showSuccess("Tipo de incidente actualizado con éxito.","Tipo de incidente").subscribe();
        }
        
        this.isLoading = false;
        await this.getAllIncidentTypes();
        this.cleanValuesOfForm();
        this.isAddIncidentType = false;
        this.isEditIncidentType = false;
      } catch(err) {
        if(this.isEditIncidentType) this.incidentTypeForm.get('incidentTypeCode')?.disable();
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.incidentTypeForm);
    }
  }

  onCancel(): void {
    this.isAddIncidentType = false;
    this.isEditIncidentType = false;
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
    return this.incidentTypeForm.get('description')?.value?.length || 0;
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
    this.incidentTypeForm.reset({});
    this.incidentTypeForm.get('incidentTypeCode')?.enable();
  }

  ngOnChanges() {
    const isActiveControl = this.incidentTypeForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddIncidentType) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }
}
