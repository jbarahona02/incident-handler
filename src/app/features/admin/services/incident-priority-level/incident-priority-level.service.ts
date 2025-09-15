import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { IncidentPriorityLevel } from '../../../../shared/interfaces/models';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

const incidentMicroService = ConstantsEndpoints.INCIDENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class IncidentPriorityLevelService {
  private allIncidentPriorityLevel : IncidentPriorityLevel[] = [];
    
    constructor(
      private httpResquestService : HttpRequestService
    ){
  
    }
  
    async getAllIncidentPriorityLevels() : Promise<IncidentPriorityLevel[]> {
      return new Promise<IncidentPriorityLevel[]>((resolve,reject)=>{
        this.httpResquestService.get<IncidentPriorityLevel[]>(incidentMicroService,AdminEndpoints.ALL_INCIDENT_PRIORITY_LEVEL)
          .then((data:IncidentPriorityLevel[]) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          })
      });
    } 
  
    transformAndReorder(data : IncidentPriorityLevel[], fieldOrder = ['id','name','description','isActive']) : TransformObject[] {
      return data.map(item => {
        // Crear nuevo objeto con las transformaciones necesarias
        const newObject : TransformObject = { ...item };
        
        // Renombrar roleCode a id
        if (newObject.hasOwnProperty('incidentPriorityLevelCode')) {
          newObject['id'] = newObject['incidentPriorityLevelCode'];
          delete newObject['incidentPriorityLevelCode'];
        }
  
        // Reordenar según el orden especificado
        const reorderObject : TransformObject = {};
  
        fieldOrder.forEach(field => {
          if(newObject.hasOwnProperty(field)){
            reorderObject[field] = newObject[field];
          }
        });
  
        return reorderObject;
      });
    }
  
    async createIncidentPriorityLevel(newIncidentPriorityLevel : IncidentPriorityLevel) : Promise<IncidentPriorityLevel> {
  
      let body = {
        incidentPriorityLevelCode : newIncidentPriorityLevel.incidentPriorityLevelCode,
        name: newIncidentPriorityLevel.name,
        description: newIncidentPriorityLevel.description
      };
  
      return new Promise<IncidentPriorityLevel>((resolve,reject)=>{
        this.httpResquestService.post<IncidentPriorityLevel>(incidentMicroService,AdminEndpoints.INCIDENT_PRIORITY_LEVEL,body)
          .then((data:IncidentPriorityLevel) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async deleteIncidentPriorityLevel(incidentPriorityLevelCode: string) : Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.httpResquestService.delete<void>(incidentMicroService,`${AdminEndpoints.INCIDENT_PRIORITY_LEVEL}/${incidentPriorityLevelCode}`)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async updateIncidentPriorityLevel(incidentPriorityLevelCode: string, updateIncidentPriorityLevel : IncidentPriorityLevel) : Promise<IncidentPriorityLevel> {
      let body = {
        name: updateIncidentPriorityLevel.name,
        description: updateIncidentPriorityLevel.description,
        isActive: updateIncidentPriorityLevel.isActive
      };
      
      return new Promise<IncidentPriorityLevel>((resolve, reject) =>{
        this.httpResquestService.put<IncidentPriorityLevel>(incidentMicroService,`${AdminEndpoints.INCIDENT_PRIORITY_LEVEL}/${incidentPriorityLevelCode}`,body)
          .then((data:IncidentPriorityLevel) => resolve(data))
          .catch(err => reject(err));
      });
    }
}
