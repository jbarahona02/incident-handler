import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectInputComponent, TextareaInputComponent, TextInputComponent } from '../../../../shared/components';
import { IncidentTypeService } from '../../../admin/services/incident-type/incident-type.service';
import { IncidentPriorityLevelService } from '../../../admin/services/incident-priority-level/incident-priority-level.service';
import { IncidentPriorityLevel, IncidentType } from '../../../../shared/interfaces/models';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from '../../../../shared/utils/common-functions';

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
  incidentPriorityLevel: IncidentPriorityLevel[] = [];
  
  constructor(
     private formGroup : FormBuilder,
     private incidentTypeService: IncidentTypeService,
     private incidentPriorityLevelService: IncidentPriorityLevelService,
     private router : Router
  ){
     this.incidentForm = this.formGroup.group({
      incidentTypeCode: ['', Validators.required],
      incidentPriorityLevelCode: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
    });
  }

  async ngOnInit(){
    this.incidentTypes = await this.getAllIncidentTypes();
    this.incidentPriorityLevel = await this.getAllIncidentPriorityLevel();
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
  }

  async onSubmit(): Promise<void> {
    if (this.incidentForm.valid) {
      try {

    
        
        this.cleanValuesOfForm();
      } catch(err) {
        
      }
    } else {
      this.markFormGroupTouched(this.incidentForm);
    }
  }
}
