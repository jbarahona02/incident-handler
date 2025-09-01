import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Incident } from '../../interfaces/models';
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

  @Input() incident: Incident = {
    incidentId: '',
    description: '',
    incidentTypeCode: '',
    locationId: '',
    incidentPriorityLevelCode: '',
    reportUserAppId: 0,
    reportedDate: new Date(),
    isCompleted: false,
    inProgress: false,
    completedDate: new Date()
  };

  getPriorityClass(priorityCode: string): string {
    const priorityMap: {[key: string]: string} = {
      'LOW': 'bg-green-100 text-green-800 border-green-500',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-500',
      'HIGH': 'bg-red-100 text-red-800 border-red-500'
    };
    return priorityMap[priorityCode] || 'bg-gray-100 text-gray-800 border-gray-500';
  }

  getPriorityText(priorityCode: string): string {
    const priorityMap: {[key: string]: string} = {
      'LOW': 'Baja',
      'MEDIUM': 'Media',
      'HIGH': 'Alta'
    };
    return priorityMap[priorityCode] || 'Desconocida';
  }

  getStatusClass(): string {
    if (this.incident.isCompleted) {
      return 'bg-green-100 text-green-800';
    } else if (this.incident.inProgress) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  }

  getStatusText(): string {
    if (this.incident.isCompleted) {
      return 'Resuelto';
    } else if (this.incident.inProgress) {
      return 'En Progreso';
    } else {
      return 'Pendiente';
    }
  }

  getIncidentTypeText(typeCode: string): string {
    const typeMap: {[key: string]: string} = {
      'PLUMBING': 'Fontanería',
      'HVAC': 'Climatización',
      'NETWORK': 'Redes',
      'MAINTENANCE': 'Mantenimiento',
      'EQUIPMENT': 'Equipo',
      'ELECTRICAL': 'Eléctrico',
      'CLEANING': 'Limpieza',
      'SECURITY': 'Seguridad'
    };
    return typeMap[typeCode] || 'Otro';
  }

  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }
}