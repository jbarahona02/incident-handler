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
  ];

  
}
