import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { Equipment, EquipmentLocation, Incident, UserApp } from '../../../../../shared/interfaces/models';
import { IncidentService } from '../../../services/incident/incident.service';
import { UserService } from '../../../services/user/user.service';
import { IncidentDetailAdminComponent } from '../../../components/incident-detail-admin/incident-detail-admin.component';
import { EquipmentLocationService } from '../../../services/equipment-location/equipment-location.service';
import { EquipmentService } from '../../../services/equipment/equipment.service';

@Component({
  selector: 'app-admin-incident-detail',
  imports: [
    RouterModule,
    IncidentDetailAdminComponent
  ],
  templateUrl: './incident-detail.page.html',
  styleUrl: './incident-detail.page.scss'
})
export class IncidentDetailPage {
  @ViewChild(IncidentDetailAdminComponent) 
  incidentDetailAdminComponent!: IncidentDetailAdminComponent;

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
  allTech: UserApp[] = [];
  allLocations: EquipmentLocation[] = [];
  allEquipments: Equipment[] = [];
  constructor(
    private incidentService : IncidentService,
    private activatedRoute : ActivatedRoute,
    private route: Router,
    private userService: UserService,
    private changeDetectorRef : ChangeDetectorRef,
    private equipmentLocationService: EquipmentLocationService,
    private equipmentService : EquipmentService
  ){
    
  }

  async ngOnInit(){
    try {
      this.activatedRoute.paramMap.subscribe(params => {
        this.incidentId = Number(params.get('id'));
      });

      this.incident = await this.incidentService.getIncidentById(this.incidentId);
      this.allTech = await this.userService.getAllTech();
      this.allLocations = await this.equipmentLocationService.getAllLocation();
      this.allEquipments = await this.equipmentService.getAllEquipment();
    } catch(err){

    }
  }

   async onTechnicianAssigned(event: any) {
  // Aquí manejas la petición HTTP
    let tech = this.allTech.find(tech => tech.userAppId == event.technicianId);
    // this.route.navigate(['admin','home']);
    try {
      await this.incidentService.assignTechnician(event.detailId,tech?.email);
      this.incident = await this.incidentService.getIncidentById(this.incidentId);
      this.changeDetectorRef.detectChanges();
    } catch(err){

    }
  }
}
