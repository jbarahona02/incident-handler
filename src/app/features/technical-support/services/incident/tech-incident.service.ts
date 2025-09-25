import { Injectable } from '@angular/core';
import { Incident } from '../../../../shared/interfaces/models';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { IncidentStatus } from '../../interfaces';
import { TechEndpoints } from '../../constants/tech-endpoints';
import { INCIDENT_FLOW } from '../../../../shared/constants/enums';

const incidentMicroService = ConstantsEndpoints.INCIDENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class TechIncidentService {
  allIncidents : Incident[] = [];
  
    constructor(
      private httpRequestService: HttpRequestService
    ){
  
    }
  
    async getAllIncident() : Promise<Incident[]> {
        return new Promise<Incident[]>((resolve,reject)=>{
          this.httpRequestService.get<Incident[]>(incidentMicroService,`${TechEndpoints.INCIDENT}`,{
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
        this.httpRequestService.post<Incident>(incidentMicroService,TechEndpoints.INCIDENT,newIncident)
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
          this.httpRequestService.get<Incident[]>(incidentMicroService,`${TechEndpoints.INCIDENT}`,{
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
        this.httpRequestService.get<Incident>(incidentMicroService,`${TechEndpoints.INCIDENT}/${id}`)
          .then((data:Incident) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          })
      });
    }

    async changeStatusDetailIncident(incidentDetailId: number, status : string) {
      let endpoint = "";

      return new Promise<Incident>((resolve,reject)=> {
        switch(status) {
          case INCIDENT_FLOW.EN_REVISION:
            endpoint = `${TechEndpoints.TO_REVISION_STATUS}/${incidentDetailId}`;
          break;

          case INCIDENT_FLOW.EN_REPARACION:
            endpoint = `${TechEndpoints.TO_FIX_STATUS}/${incidentDetailId}`;
          break;

          case INCIDENT_FLOW.REPARADO:
            endpoint =  `${TechEndpoints.TO_FIXED_STATUS}/${incidentDetailId}`;
          break;

          case INCIDENT_FLOW.FINALIZADO:
            endpoint =  `${TechEndpoints.TO_FINISHED_STATUS}/${incidentDetailId}`;
          break;
        }
        
        this.httpRequestService.patch<Incident>(incidentMicroService,endpoint)
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

