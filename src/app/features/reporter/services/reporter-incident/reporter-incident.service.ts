import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { Incident } from '../../../../shared/interfaces/models';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { ReporterEndpoints } from '../../constants/reporter-endpoints';

const incidentMicroService = ConstantsEndpoints.INCIDENT_MICROSERVICE;
@Injectable({
  providedIn: 'root'
})
export class ReporterIncidentService {
  allIncidents : Incident[] = [];
  
  constructor(
    private httpRequestService: HttpRequestService
  ){

  }

  async getAllIncident() : Promise<Incident[]> {
      return new Promise<Incident[]>((resolve,reject)=>{
        this.httpRequestService.get<Incident[]>(incidentMicroService,`${ReporterEndpoints.INCIDENT}`,{
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

  addIncident(newIncident: NewIncident) : Promise<Incident>{
    return new Promise<Incident>((resolve,reject)=>{
      this.httpRequestService.post<Incident>(incidentMicroService,ReporterEndpoints.INCIDENT,newIncident)
        .then((data:Incident) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getAllIncidentWithParams(status: string, startDate: string, endDate: string) : Promise<Incident[]> {
    return new Promise<Incident[]>((resolve,reject)=>{
        this.httpRequestService.get<Incident[]>(incidentMicroService,`${ReporterEndpoints.INCIDENT}`,{
          params: {
            isCompleted: status == "completed",
            isInProgress: status == "not-completed",
            startDate: startDate ? startDate : '1990-01-01',
            endDate: endDate ?  endDate : this.getCurrentDate() 
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

  async getIncidentById(id: number) : Promise<Incident>{
    return new Promise<Incident>((resolve, reject)=>{
      this.httpRequestService.get<Incident>(incidentMicroService,`${ReporterEndpoints.INCIDENT}/${id}`)
        .then((data:Incident) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  }
  
}

interface NewIncident {
  description: "string",
  incidentTypeCode: "string",
  incidentPriorityLevelCode: "string",
  details: [
    {
      description: string,
      equipmentId: number,
      equipmentLocationId: number
    }
  ]
}

