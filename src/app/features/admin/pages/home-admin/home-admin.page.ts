import { Component } from '@angular/core';
import { Incident } from '../../../../shared/interfaces/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { INCIDENT_STATUS, PRIORITIES } from '../../../../shared/constants/enums';
import { IncidentCard } from '../../../../shared/components/incident-card/incident-card.component';

@Component({
  selector: 'app-home-admin.page',
  imports: [
    CommonModule,
    RouterModule,
    IncidentCard
  ],
  templateUrl: './home-admin.page.html',
  styleUrl: './home-admin.page.scss'
})
export class HomeAdminPage {
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

  
}
