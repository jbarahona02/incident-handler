import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputComponent, IncidentCard, SelectInputComponent, TextInputComponent } from '../../../../shared/components';
import { IncidentStatus } from '../../../technical-support/interfaces';
import { Incident } from '../../../../shared/interfaces/models';
import { Router, RouterModule } from '@angular/router';
import { ReporterIncidentService } from '../../services/reporter-incident/reporter-incident.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-reporter-incidents',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    DateInputComponent,
    IncidentCard,
    RouterModule
],
  templateUrl: './incidents.page.html',
  styleUrl: './incidents.page.scss'
})
export class IncidentsPage {

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
    private reporterIncidentService : ReporterIncidentService
  ){
    this.searchForm = this.formGroup.group({
      status: ['',],
      reportedDate: [''],
      completedDate: ['']
    });
  }

  async ngOnInit(){
     this.changeDetectorRef.detectChanges();
     try {
       this.incidents = await this.reporterIncidentService.getAllIncident();
       this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);

       this.searchForm.get('status')?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(async (data) => {
          if(data) this.isSearching = true;
          else {
            this.isSearching = false;
            this.incidents = await this.reporterIncidentService.getAllIncident();
            this.incidents = this.incidents.sort((a,b) => b.incidentId - a.incidentId);
            this.searchForm.reset();
          }
        });
     } catch(err){

     }
  }

  addIncident(){
    this.router.navigate(["reporter","add-incident"]);
  }

  async onSubmit(){
    try {
        if(this.searchForm.get('status')?.value){
            this.incidents = await this.reporterIncidentService.getAllIncidentWithParams(
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
