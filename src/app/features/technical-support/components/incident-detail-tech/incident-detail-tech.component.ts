import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Equipment, EquipmentLocation, Incident } from '../../../../shared/interfaces/models';

@Component({
  selector: 'app-incident-detail-tech',
  imports: [
    CommonModule
  ],
  templateUrl: './incident-detail-tech.component.html',
  styleUrl: './incident-detail-tech.component.scss'
})
export class IncidentDetailTechComponent {
  @Input({ required: true }) incident!: Incident;
  @Input() equipmentLocations: EquipmentLocation[] = [];
  @Input() equipments: Equipment[] = [];
  @Output() statusChanged = new EventEmitter<{ detailId: number, newStatusCode: string }>();

  // Orden de los estados y transiciones permitidas
  statusFlow = {
    'PEN_ASG': { 
      next: 'ASG', 
      allowed: true, 
      text: 'Asignar',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    },
    'ASG': { 
      next: 'REV', 
      allowed: true, 
      text: 'Iniciar Revisión',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
    },
    'REV': { 
      next: 'REP', 
      allowed: true, 
      text: 'Iniciar Reparación',
      buttonColor: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
    },
    'REP': { 
      next: 'REPA', 
      allowed: true, 
      text: 'Marcar como Reparado',
      buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    },
    'REPA': { 
      next: 'FIN', 
      allowed: true, 
      text: 'Finalizar',
      buttonColor: 'bg-green-700 hover:bg-green-800 focus:ring-green-600'
    },
    'FIN': { 
      next: null, 
      allowed: false, 
      text: 'Finalizado',
      buttonColor: 'bg-gray-400 hover:bg-gray-500 focus:ring-gray-400'
    }
  };

  // Mapeo de códigos de estado a propiedades visuales
  statusConfig = {
    'PEN_ASG': {
      text: 'Pendiente de asignar',
      icon: 'warning',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    'ASG': {
      text: 'Asignado',
      icon: 'assignment',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    'REV': {
      text: 'En revisión',
      icon: 'search',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600'
    },
    'REP': {
      text: 'En reparación',
      icon: 'build',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    },
    'REPA': {
      text: 'Reparado',
      icon: 'check_circle',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    'FIN': {
      text: 'Finalizado',
      icon: 'verified',
      borderColor: 'border-green-700',
      bgColor: 'bg-green-200',
      textColor: 'text-green-900',
      iconColor: 'text-green-700'
    }
  };

  getStatusConfig(statusCode: string) {
    return this.statusConfig[statusCode as keyof typeof this.statusConfig] || 
           this.statusConfig['PEN_ASG'];
  }

  // Obtener clase del botón según el estado actual
  getButtonClass(detail: any): string {
    const currentStatus = detail.incidentDetailStatus.incidentDetailStatusCode;
    const statusInfo = this.statusFlow[currentStatus as keyof typeof this.statusFlow];
    
    if (!statusInfo) {
      return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
    }
    
    return statusInfo.buttonColor;
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

  // Verificar si se puede cambiar el estado
  canChangeStatus(detail: any): boolean {
    const currentStatus = detail.incidentDetailStatus.incidentDetailStatusCode;
    const statusInfo = this.statusFlow[currentStatus as keyof typeof this.statusFlow];
    
    if (!statusInfo) return false;
    
    // Verificar reglas específicas
    if (currentStatus === 'PEN_ASG' && !detail.technicianUserAppId) {
      return false; // No se puede asignar sin técnico
    }
    
    return statusInfo.allowed && statusInfo.next !== null;
  }

  // Obtener texto del botón según el siguiente estado
  getNextStatusButtonText(detail: any): string {
    const currentStatus = detail.incidentDetailStatus.incidentDetailStatusCode;
    const statusInfo = this.statusFlow[currentStatus as keyof typeof this.statusFlow];
    return statusInfo?.text || 'Estado no disponible';
  }

  // Obtener razón por la que está deshabilitado
  getDisabledReason(detail: any): string {
    const currentStatus = detail.incidentDetailStatus.incidentDetailStatusCode;
    
    if (currentStatus === 'FIN') {
      return 'Incidente finalizado';
    }
    
    if (currentStatus === 'PEN_ASG' && !detail.technicianUserAppId) {
      return 'Asigna un técnico primero';
    }
    
    const statusInfo = this.statusFlow[currentStatus as keyof typeof this.statusFlow];
    if (!statusInfo?.allowed) {
      return 'Transición no permitida';
    }
    
    return 'Estado no puede ser cambiado';
  }

  // Manejar cambio de estado
  onStatusChange(detail: any): void {
    if (!this.canChangeStatus(detail)) return;
    
    const currentStatus = detail.incidentDetailStatus.incidentDetailStatusCode;
    const nextStatusCode = this.statusFlow[currentStatus as keyof typeof this.statusFlow].next;
    
    if (nextStatusCode) {
      this.statusChanged.emit({
        detailId: detail.incidentDetailId,
        newStatusCode: nextStatusCode
      });
    }
  }

  getEquipmentLocation(equipmentLocationId: number) : string {
    return this.equipmentLocations.find(e => e.equipmentLocationId = equipmentLocationId)?.name ?? '';
  }

  getEquipment(equipmenId: number) : string {
    let equipment = this.equipments.find(e => e.equipmentId = equipmenId);
  
    return equipment?.name + " " + equipment?.brand;
  }
}
