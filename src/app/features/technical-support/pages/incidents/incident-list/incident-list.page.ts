import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputComponent, IncidentCard, SelectInputComponent } from '../../../../../shared/components';
import { Router, RouterModule } from '@angular/router';
import { Incident } from '../../../../../shared/interfaces/models';
import { IncidentStatus } from '../../../interfaces';
import { TechIncidentService } from '../../../services/incident/tech-incident.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-tech-incident-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    DateInputComponent,
    IncidentCard,
    RouterModule
  ],
  templateUrl: './incident-list.page.html',
  styleUrl: './incident-list.page.scss'
})
export class IncidentListPage {
  incidents: Incident[] = [];
  isSearching : boolean = false;
    
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

  constructor(
    private formGroup : FormBuilder,
    private router : Router,
    private changeDetectorRef: ChangeDetectorRef,
    private techIncidentService : TechIncidentService
  ){
    this.searchForm = this.formGroup.group({
      status: [''],
      reportedDate: [''],
      completedDate: ['']
    });
  }

  async ngOnInit(){
     this.changeDetectorRef.detectChanges();
     try {
       this.incidents = await this.techIncidentService.getAllIncident();
       this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);

       this.searchForm.get('status')?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(async (data) => {
          if(data) this.isSearching = true;
          else {
            this.isSearching = false;
            this.incidents = await this.techIncidentService.getAllIncident();
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
            this.incidents = await this.techIncidentService.getAllIncidentWithParams(
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

  cleanValuesOfForm(){
    this.searchForm.reset({});
  }
}
