import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Equipment, EquipmentLocation, Incident, IncidentDetailStatus, UserApp, } from '../../../../shared/interfaces/models';
import { SelectInputComponent } from '../../../../shared/components';
import { EquipmentLocationService } from '../../services/equipment-location/equipment-location.service';

@Component({
  selector: 'app-incident-detail-admin',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './incident-detail-admin.component.html',
  styleUrls: ['./incident-detail-admin.component.scss']
})
export class IncidentDetailAdminComponent {
  @Input({ required: true }) incident!: Incident;
  @Input() title: string = 'Detalle del Incidente';
  @Input() technicians: UserApp[] = []; // Lista de técnicos disponibles
  @Input() equipmentLocations: EquipmentLocation[] = [];
  @Input() equipments: Equipment[] = [];

  @Output() technicianAssigned = new EventEmitter<{ detailId: number, technicianId: number }>();

  isExpanded: boolean = true;

  // Mapeo de códigos de estado a propiedades visuales
  statusConfig = {
    'PEN_ASG': {
      text: 'Pendiente de asignar',
      icon: 'warning',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-incidente-pendiente',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    'ASG': {
      text: 'Asignado',
      icon: 'assignment',
      borderColor: 'border-blue-500',
      bgColor: 'bg-incidente-asignado',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    'REV': {
      text: 'En revisión',
      icon: 'search',
      borderColor: 'border-pink-500',
      bgColor: 'bg-incidente-revision',
      textColor: 'text-pink-800',
      iconColor: 'text-pink-600'
    },
    'REP': {
      text: 'En reparación',
      icon: 'build',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-incidente-reparacion',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    'REPA': {
      text: 'Reparado',
      icon: 'check_circle',
      borderColor: 'border-green-500',
      bgColor: 'bg-incidente-reparado',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    'FIN': {
      text: 'Finalizado',
      icon: 'verified',
      borderColor: 'border-green-500',
      bgColor: 'bg-incidente-finalizado',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    }
  };

  // Mapeo de códigos de prioridad a textos
  priorityTexts: { [key: string]: string } = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta',
    'CRITICAL': 'Crítica'
  };

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  getMainStatus(): IncidentDetailStatus {
    return this.incident.incidentDetails[0]?.incidentDetailStatus || 
           { incidentDetailStatusCode: 'PEN_ASG', name: 'Pendiente', description: '' };
  }

  getStatusConfig(statusCode: string) {
    return this.statusConfig[statusCode as keyof typeof this.statusConfig] || 
           this.statusConfig['PEN_ASG'];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProgressPercentage(): number {
    const statusOrder = ['PEN_ASG', 'ASG', 'REV', 'REP', 'REPA', 'FIN'];
    const currentStatus = this.getMainStatus().incidentDetailStatusCode;
    const currentIndex = statusOrder.indexOf(currentStatus);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  }

  getPriorityClass(priorityCode: string): string {
    const priorityClasses: { [key: string]: string } = {
      'LOW': 'bg-priority-low',
      'MEDIUM': 'bg-priority-medium', 
      'HIGH': 'bg-priority-high',
      'CRITICAL': 'bg-priority-critical'
    };
    return priorityClasses[priorityCode] || 'bg-gray-200 text-gray-800';
  }

  getProgressBarClass(statusCode: string): string {
    const progressClasses: { [key: string]: string } = {
      'PEN_ASG': 'bg-progress-pendiente',
      'ASG': 'bg-progress-asignado',
      'REV': 'bg-progress-revision', 
      'REP': 'bg-progress-reparacion',
      'REPA': 'bg-progress-reparado',
      'FIN': 'bg-progress-finalizado'
    };
    return progressClasses[statusCode] || 'bg-gray-400';
  }

  getStatusSummary(): { count: number, statusCode: string }[] {
    const summary: { [key: string]: number } = {};
    
    this.incident.incidentDetails.forEach(detail => {
      const statusCode = detail.incidentDetailStatus.incidentDetailStatusCode;
      summary[statusCode] = (summary[statusCode] || 0) + 1;
    });

    return Object.entries(summary).map(([statusCode, count]) => ({
      count,
      statusCode
    }));
  }

  onTechnicianSelected(detail: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const technicianId = selectElement.value ? parseInt(selectElement.value, 10) : 0;
    
    this.technicianAssigned.emit({
      detailId: detail.incidentDetailId,
      technicianId: technicianId
    });
  }

  getTechnicianName(technicianId: number): string {
    const technician = this.technicians.find(tech => tech.userAppId === technicianId);
    return technician ? technician.name : '';
  }

  getEquipmentLocation(equipmentLocationId: number) : string {
    return this.equipmentLocations.find(e => e.equipmentLocationId = equipmentLocationId)?.name ?? '';
  }

  getEquipment(equipmenId: number) : string {
    let equipment = this.equipments.find(e => e.equipmentId = equipmenId);
  
    return equipment?.name + " " + equipment?.brand;
  }
}
