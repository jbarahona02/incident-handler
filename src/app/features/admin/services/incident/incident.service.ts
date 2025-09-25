import { Injectable } from '@angular/core';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { Incident } from '../../../../shared/interfaces/models';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const incidentMicroService = ConstantsEndpoints.INCIDENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(
    private httpRequestService : HttpRequestService,
  ){

  }

  async getAllIncident() : Promise<Incident[]> {
    return new Promise<Incident[]>((resolve,reject)=>{
      this.httpRequestService.get<Incident[]>(incidentMicroService,`${AdminEndpoints.INCIDENT}`,{
          params: {
            startDate: '1990-01-01',
            endDate: this.getCurrentDate()
          }
        })
        .then((data:Incident[]) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  } 

  async getAllIncidentWithParams(status: string, startDate: string, endDate: string) : Promise<Incident[]> {
     return new Promise<Incident[]>((resolve,reject)=>{
      this.httpRequestService.get<Incident[]>(incidentMicroService,`${AdminEndpoints.INCIDENT}`,{
          params: {
            isCompleted: status == "completed",
            isInProgress: status == "not-completed",
            startDate: startDate != "" ? startDate : '1990-01-01',
            endDate: endDate != "" ?  endDate : this.getCurrentDate() 
          }
        })
        .then((data:Incident[]) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getIncidentById(id: number) : Promise<Incident>{
    return new Promise<Incident>((resolve, reject)=>{
      this.httpRequestService.get<Incident>(incidentMicroService,`${AdminEndpoints.INCIDENT}/${id}`)
        .then((data:Incident) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  }

  assignTechnician(incidentDetailId: number, assignmentData: string | undefined ): Promise<any> {
    return this.httpRequestService.patch(incidentMicroService,`${AdminEndpoints.INCIDENT}/assign-technical/${incidentDetailId}`,{technicianUserAppEmail: assignmentData});
  }
}

