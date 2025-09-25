import { ChangeDetectorRef, Component } from '@angular/core';
import { IncidentDetailTechComponent } from '../../../components/incident-detail-tech/incident-detail-tech.component';
import { Equipment, EquipmentLocation, Incident } from '../../../../../shared/interfaces/models';
import { TechIncidentService } from '../../../services/incident/tech-incident.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentLocationService } from '../../../../admin/services/equipment-location/equipment-location.service';
import { EquipmentService } from '../../../../admin/services/equipment/equipment.service';

@Component({
  selector: 'app-incident-detail.page',
  imports: [
    IncidentDetailTechComponent
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
  allLocations: EquipmentLocation[] = [];
  allEquipments: Equipment[] = [];

  constructor(
    private incidentTechService : TechIncidentService,
    private activatedRoute : ActivatedRoute,
    private changeDetectorRef : ChangeDetectorRef,
    private equipmentLocationService: EquipmentLocationService,
    private equipmentService: EquipmentService
  ){
    
  }
  
  async ngOnInit(){
    try {
      this.activatedRoute.paramMap.subscribe(params => {
        this.incidentId = Number(params.get('id'));
      });

      this.incident = await this.incidentTechService.getIncidentById(this.incidentId);
      this.allLocations = await this.equipmentLocationService.getAllLocation();
      this.allEquipments = await this.equipmentService.getAllEquipment();
    } catch(err){

    }
  }

  async onStatusChanged(event: { detailId: number, newStatusCode: string }) {
    try {
      await this.incidentTechService.changeStatusDetailIncident(event.detailId,event.newStatusCode);
      this.incident = await this.incidentTechService.getIncidentById(this.incidentId);
      this.changeDetectorRef.detectChanges();
    } catch(err){

    }
  }
}
