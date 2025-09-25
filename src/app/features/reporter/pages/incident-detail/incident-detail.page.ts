import { Component } from '@angular/core';
import { ReporterIncidentService } from '../../services/reporter-incident/reporter-incident.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IncidentListComponent } from '../../components/incident-list/incident-list.component';
import { Equipment, Incident } from '../../../../shared/interfaces/models';
import { EquipmentService } from '../../../admin/services/equipment/equipment.service';

@Component({
  selector: 'app-reporter-incident-detail',
  imports: [
    RouterModule,
    IncidentListComponent
  ],
  templateUrl: './incident-detail.page.html',
  styleUrl: './incident-detail.page.scss'
})
export class IncidentDetailPage {

  incidentId : number = 0;
  incident : Incident = {
    incidentId: 0,
    description: '',
    incidentType: {
      description: '',
      incidentTypeCode: '',
      name: ''
    },
    locationId: '',
    incidentPriorityLevel: {
      description: '',
      incidentPriorityLevelCode: '',
      name: ''
    },
    reportUserAppId: 0,
    reportedDate: '',
    isCompleted: false,
    inProgress: false,
    completedDate: '',
    incidentDetails: []
  };
  allEquipments: Equipment[] = [];

  constructor(
    private reporterIncidentService : ReporterIncidentService,
    private route : ActivatedRoute,
    private equipmentService: EquipmentService
  ){
    
  }

  async ngOnInit(){
    try {
      this.route.paramMap.subscribe(params => {
        this.incidentId = Number(params.get('id'));
      });

      this.incident = await this.reporterIncidentService.getIncidentById(this.incidentId);
      this.allEquipments = await this.equipmentService.getAllEquipment();
    } catch(err){

    }
  }
}
