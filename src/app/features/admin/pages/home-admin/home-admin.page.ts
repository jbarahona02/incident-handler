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
      id: 1,
      title: 'Error en servidor principal',
      description: 'El servidor no responde a las solicitudes HTTP',
      date: new Date('2023-05-15'),
      status: INCIDENT_STATUS.DONE,
      priority: PRIORITIES.HIGH
    },
    {
      id: 2,
      title: 'Actualización fallida de base de datos',
      description: 'La migración de datos falló en el paso 3',
      date: new Date('2023-06-20'),
      status: INCIDENT_STATUS.DONE,
      priority: PRIORITIES.HIGH
    },
    {
      id: 3,
      title: 'Problema de conectividad en área de producción',
      description: 'Los dispositivos IoT no se conectan al gateway',
      date: new Date('2023-07-10'),
       status: INCIDENT_STATUS.DONE,
      priority: PRIORITIES.HIGH
    },
    {
      id: 4,
      title: 'Interfaz de usuario no responde',
      description: 'La página de dashboard se congela al cargar gráficos',
      date: new Date('2023-07-12'),
       status: INCIDENT_STATUS.DONE,
      priority: PRIORITIES.HIGH
    }
  ];

  
}
