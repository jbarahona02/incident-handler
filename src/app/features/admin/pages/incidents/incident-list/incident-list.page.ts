import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputComponent, IncidentCard, SelectInputComponent } from '../../../../../shared/components';
import { Router } from '@angular/router';
import { IncidentStatus } from '../../../../technical-support/interfaces';
import { Incident } from '../../../../../shared/interfaces/models';
import { IncidentService } from '../../../services/incident/incident.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-incident-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    DateInputComponent,
    IncidentCard
  ],
  templateUrl: './incident-list.page.html',
  styleUrl: './incident-list.page.scss'
})
export class IncidentListPage {
   incidents: Incident[] = [];
  
    
  searchForm : FormGroup;
  allIncidentStatus: IncidentStatus[] = [
    {
      label: "Completado",
      value: "completed"
    },
    {
      label: "No completado",
      value: "not-completed"
    }
  ];

  routerToDetail = ["reporter","incident-detail"];
  isSearching : boolean = false;

  constructor(
    private formGroup : FormBuilder,
    private router : Router,
    private changeDetectorRef: ChangeDetectorRef,
    private incidentService: IncidentService
  ){
    this.searchForm = this.formGroup.group({
      status: ['',],
      reportedDate: [''],
      completedDate: ['']
    });
  }

  async ngOnInit(){
     try {
        this.changeDetectorRef.detectChanges();
        this.incidents = await this.incidentService.getAllIncident();
        this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);

        this.searchForm.get('status')?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(async (data) => {
          if(data) this.isSearching = true;
          else {
            this.isSearching = false;
            this.incidents = await this.incidentService.getAllIncident();
            this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);
            this.searchForm.reset();
          }
        });
     } catch(err){

     }
  }

  async onSubmit(){
    try {
        if(this.searchForm.get('status')?.value){
            this.incidents = await this.incidentService.getAllIncidentWithParams(
              this.searchForm.get('status')?.value,
              this.searchForm.get('reportedDate')?.value,
              this.searchForm.get('completedDate')?.value
            );
            this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);
        }
    } catch (err) {

    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
