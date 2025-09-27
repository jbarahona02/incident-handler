import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { EquipmentLocation } from '../../../../shared/interfaces/models';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

const equipmentMicroService = ConstantsEndpoints.EQUIPMENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class EquipmentLocationService {
    private allLocation : Location[] = [];
    
    constructor(
      private httpResquestService : HttpRequestService
    ){
  
    }
  
    async getAllLocation() : Promise<EquipmentLocation[]> {
      return new Promise<EquipmentLocation[]>((resolve,reject)=>{
        this.httpResquestService.get<EquipmentLocation[]>(equipmentMicroService,AdminEndpoints.EQUIPMENT_LOCATION)
          .then((data:EquipmentLocation[]) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          })
      });
    } 
  
    transformAndReorder(data : EquipmentLocation[], fieldOrder = ['id','name','roomCode','ubication','floor','isActive']) : TransformObject[] {
      return data.map(item => {
        // Crear nuevo objeto con las transformaciones necesarias
        const newObject : TransformObject = { ...item };
        
        // Renombrar code a id
        if (newObject.hasOwnProperty('equipmentLocationId')) {
          newObject['id'] = newObject['equipmentLocationId'];
          delete newObject['equipmentLocationId'];
        }
        
        newObject['ubication'] = item.isHighSchool ? 'Diversificado' : item.isAdministrative ? 'Oficina' : 'Básicos';
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
  
    async createEquipmentLocation(newEquipmentLocation : EquipmentLocation) : Promise<EquipmentLocation> {
  
      let body = {
        name: newEquipmentLocation.name,
        assignedUser: newEquipmentLocation.assignedUser ? newEquipmentLocation.assignedUser : null ,
        isHighSchool: newEquipmentLocation.isHighSchool,
        isAdministrative: newEquipmentLocation.isAdministrative,
        roomCode: newEquipmentLocation.roomCode,
        floor: newEquipmentLocation.floor.toString(),
        isActive: true
      };
  
      return new Promise<EquipmentLocation>((resolve,reject)=>{
        this.httpResquestService.post<EquipmentLocation>(equipmentMicroService,AdminEndpoints.EQUIPMENT_LOCATION,body)
          .then((data:EquipmentLocation) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async deleteEquipmentLocation(equipmentLocationId: string) : Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.httpResquestService.delete<void>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_LOCATION}/${equipmentLocationId}`)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async updateEquipmentLocation(equipmentLocationId: number, equipmentLocation : EquipmentLocation) : Promise<EquipmentLocation> {
      let body = {
        name: equipmentLocation.name,
        assignedUser: equipmentLocation.assignedUser ? equipmentLocation.assignedUser : null,
        isHighSchool: equipmentLocation.isHighSchool,
        isAdministrative: equipmentLocation.isAdministrative,
        roomCode: equipmentLocation.roomCode,
        floor: equipmentLocation.floor,
        isActive: equipmentLocation.isActive
      };
      
      return new Promise<EquipmentLocation>((resolve, reject) =>{
        this.httpResquestService.put<EquipmentLocation>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_LOCATION}/${equipmentLocationId}`,body)
          .then((data:EquipmentLocation) => resolve(data))
          .catch(err => reject(err));
      });
    }

    async getEquipmentLocationById(equipmentLocationId : number) : Promise<EquipmentLocation>{
      return new Promise<EquipmentLocation>((resolve, reject) =>{
        this.httpResquestService.get<EquipmentLocation>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_LOCATION}/${equipmentLocationId}`,)
          .then((data:EquipmentLocation) => resolve(data))
          .catch(err => reject(err));
      });
    }
}
