import { Injectable } from '@angular/core';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { IncidentType } from '../../../../shared/interfaces/models';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';


const incidentMicroService = ConstantsEndpoints.INCIDENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class IncidentTypeService {
  private allIncidentType : IncidentType[] = [];
  
  constructor(
    private httpResquestService : HttpRequestService
  ){

  }

  async getAllIncidentTypes() : Promise<IncidentType[]> {
    return new Promise<IncidentType[]>((resolve,reject)=>{
      this.httpResquestService.get<IncidentType[]>(incidentMicroService,AdminEndpoints.ALL_INCIDENT_TYPES)
        .then((data:IncidentType[]) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  } 

  transformAndReorder(data : IncidentType[], fieldOrder = ['id','name','description','isActive']) : TransformObject[] {
    return data.map(item => {
      // Crear nuevo objeto con las transformaciones necesarias
      const newObject : TransformObject = { ...item };
      
      // Renombrar roleCode a id
      if (newObject.hasOwnProperty('incidentTypeCode')) {
        newObject['id'] = newObject['incidentTypeCode'];
        delete newObject['incidentTypeCode'];
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

  async createIncidentType(newIncidentType : IncidentType) : Promise<IncidentType> {

    let body = {
      incidentTypeCode : newIncidentType.incidentTypeCode,
      name: newIncidentType.name,
      description: newIncidentType.description
    };

    return new Promise<IncidentType>((resolve,reject)=>{
      this.httpResquestService.post<IncidentType>(incidentMicroService,AdminEndpoints.INCIDENT_TYPES,body)
        .then((data:IncidentType) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async deleteIncidentType(incidentTypeCode: string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.httpResquestService.delete<void>(incidentMicroService,`${AdminEndpoints.INCIDENT_TYPES}/${incidentTypeCode}`)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async updateIncidentType(incidentTypeCode: string, updateIncidentType : IncidentType) : Promise<IncidentType> {
    let body = {
      name: updateIncidentType.name,
      description: updateIncidentType.description,
      isActive: updateIncidentType.isActive
    };
    
    return new Promise<IncidentType>((resolve, reject) =>{
      this.httpResquestService.put<IncidentType>(incidentMicroService,`${AdminEndpoints.INCIDENT_TYPES}/${incidentTypeCode}`,body)
        .then((data:IncidentType) => resolve(data))
        .catch(err => reject(err));
    });
  }
}
