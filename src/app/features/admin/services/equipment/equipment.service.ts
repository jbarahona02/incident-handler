import { Injectable } from '@angular/core';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { Equipment } from '../../../../shared/interfaces/models';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

const equipmentMicroService = ConstantsEndpoints.EQUIPMENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
   private allEquipmentType : Equipment[] = [];
        
  constructor(
    private httpResquestService : HttpRequestService
  ){

  }

  async getAllEquipment() : Promise<Equipment[]> {
    return new Promise<Equipment[]>((resolve,reject)=>{
      this.httpResquestService.get<Equipment[]>(equipmentMicroService,AdminEndpoints.EQUIPMENT)
        .then((data:Equipment[]) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  } 

  transformAndReorder(data : Equipment[], fieldOrder = ['id','name','brand','serialNumber','model','isActive']) : TransformObject[] {
    return data.map(item => {
      // Crear nuevo objeto con las transformaciones necesarias
      const newObject : TransformObject = { ...item };
      
      // Renombrar code a id
      if (newObject.hasOwnProperty('equipmentId')) {
        newObject['id'] = newObject['equipmentId'];
        delete newObject['equipmentId'];
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

  async createEquipment(newEquipment : Equipment) : Promise<Equipment> {

    let body = {
      name: newEquipment.name,
      equipmentTypeCode: newEquipment.equipmentTypeCode,
      brand: newEquipment.brand,
      color: newEquipment.color,
      serialNumber: newEquipment.serialNumber,
      model: newEquipment.model,
      equipmentLocationId: newEquipment.equipmentLocationId,
      warrantyExpiredDate: newEquipment.warrantyExpiredDate,
      isWarrantyExpired: newEquipment.isWarrantyExpired,
      isActive: true
    };

    return new Promise<Equipment>((resolve,reject)=>{
      this.httpResquestService.post<Equipment>(equipmentMicroService,AdminEndpoints.EQUIPMENT,body)
        .then((data:Equipment) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async deleteEquipment(equipmentId: string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.httpResquestService.delete<void>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT}/${equipmentId}`)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async updateEquipment(equipmentId: number, equipment : Equipment) : Promise<Equipment> {
    let body = {
      name: equipment.name,
      equipmentTypeCode: equipment.equipmentTypeCode,
      brand: equipment.brand,
      color: equipment.color,
      serialNumber: equipment.serialNumber,
      model: equipment.model,
      equipmentLocationId: equipment.equipmentLocationId,
      warrantyExpiredDate: equipment.warrantyExpiredDate,
      isWarrantyExpired: false,
      isActive: true
    };
    
    return new Promise<Equipment>((resolve, reject) =>{
      this.httpResquestService.put<Equipment>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT}/${equipmentId}`,body)
        .then((data:Equipment) => resolve(data))
        .catch(err => reject(err));
    });
  }

  async getEquipmentById(equipmentId : number) : Promise<Equipment>{
    return new Promise<Equipment>((resolve, reject) =>{
      this.httpResquestService.get<Equipment>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT}/${equipmentId}`,)
        .then((data:Equipment) => resolve(data))
        .catch(err => reject(err));
    });
  }
}
