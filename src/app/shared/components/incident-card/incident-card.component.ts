import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Incident } from '../../interfaces/models';
import { INCIDENT_STATUS, PRIORITIES } from '../../constants/enums';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-incident-card',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './incident-card.component.html',
  styleUrl: './incident-card.component.scss',
})
export class IncidentCard {

  @Input() incident : Incident = {
    date: new Date(),
    description: "",
    id: 0,
    priority: PRIORITIES.HIGH,
    status: INCIDENT_STATUS.ASSIGNED,
    title: ""
  }; 
  
  getPriorityClass(priority: string): string {
    return {
      'baja': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-red-100 text-red-800'
    }[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusClass(status: string): string {
    return {
      'pendiente': 'bg-red-100 text-red-800',
      'en_progreso': 'bg-blue-100 text-blue-800',
      'resuelto': 'bg-green-100 text-green-800'
    }[status] || 'bg-gray-100 text-gray-800';
  }
}
