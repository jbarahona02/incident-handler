import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputComponent, IncidentCard, SelectInputComponent, TextInputComponent } from '../../../../shared/components';
import { IncidentStatus } from '../../../technical-support/interfaces';
import { Incident } from '../../../../shared/interfaces/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporter-incidents',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    DateInputComponent,
    IncidentCard
  ],
  templateUrl: './incidents.page.html',
  styleUrl: './incidents.page.scss'
})
export class IncidentsPage {

  incidents: Incident[] = [
      {
      incidentId: 'INC-001',
      description: 'Fuga de agua en el baño principal del segundo piso',
      incidentTypeCode: 'PLUMBING',
      locationId: 'LOC-001',
      incidentPriorityLevelCode: 'HIGH',
      reportUserAppId: 1001,
      reportedDate: new Date('2024-01-15T08:30:00'),
      isCompleted: false,
      inProgress: true,
      completedDate: new Date()
    },
    {
      incidentId: 'INC-002',
      description: 'Aire acondicionado no funciona en la oficina 304',
      incidentTypeCode: 'HVAC',
      locationId: 'LOC-002',
      incidentPriorityLevelCode: 'MEDIUM',
      reportUserAppId: 1002,
      reportedDate: new Date('2024-01-14T14:20:00'),
      isCompleted: true,
      inProgress: false,
      completedDate: new Date('2024-01-15T10:00:00')
    },
    {
      incidentId: 'INC-003',
      description: 'Conexión de internet intermitente en el área de desarrollo',
      incidentTypeCode: 'NETWORK',
      locationId: 'LOC-003',
      incidentPriorityLevelCode: 'HIGH',
      reportUserAppId: 1003,
      reportedDate: new Date('2024-01-15T09:45:00'),
      isCompleted: false,
      inProgress: true,
      completedDate: new Date()
    },
    {
      incidentId: 'INC-004',
      description: 'Puerta del almacén principal no cierra correctamente',
      incidentTypeCode: 'MAINTENANCE',
      locationId: 'LOC-004',
      incidentPriorityLevelCode: 'LOW',
      reportUserAppId: 1004,
      reportedDate: new Date('2024-01-13T16:00:00'),
      isCompleted: false,
      inProgress: false,
      completedDate: new Date()
    },
    {
      incidentId: 'INC-005',
      description: 'Proyector no enciende en la sala de conferencias A',
      incidentTypeCode: 'EQUIPMENT',
      locationId: 'LOC-005',
      incidentPriorityLevelCode: 'MEDIUM',
      reportUserAppId: 1005,
      reportedDate: new Date('2024-01-15T11:30:00'),
      isCompleted: true,
      inProgress: false,
      completedDate: new Date('2024-01-15T15:45:00')
    }
    ];
  
    
  searchForm : FormGroup;
  allIncidentStatus: IncidentStatus[] = [
    {
      label: "Completado",
      value: "completed"
    },
    {
      label: "No completado",
      value: "not-completed"
    }
  ];

  constructor(
    private formGroup : FormBuilder,
    private router : Router,
    private changeDetectorRef: ChangeDetectorRef
  ){
    this.searchForm = this.formGroup.group({
      status: [''],
      reportedDate: [''],
      completedDate: ['']
    });
  }

  ngOnInit(){
     this.changeDetectorRef.detectChanges();
  }

  addIncident(){
    this.router.navigate(["reporter","add-incident"]);
  }

  onSubmit(){
    console.log("VALOR: ", this.searchForm.value);
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
