import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { EquipmentType } from '../../../../shared/interfaces/models';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';

const equipmentMicroService = ConstantsEndpoints.EQUIPMENT_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {
    private allEquipmentType : EquipmentType[] = [];
      
    constructor(
      private httpResquestService : HttpRequestService
    ){
  
    }
  
    async getAllEquipmentType() : Promise<EquipmentType[]> {
      return new Promise<EquipmentType[]>((resolve,reject)=>{
        this.httpResquestService.get<EquipmentType[]>(equipmentMicroService,AdminEndpoints.EQUIPMENT_TYPE)
          .then((data:EquipmentType[]) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          })
      });
    } 
  
    transformAndReorder(data : EquipmentType[], fieldOrder = ['id','name','description','isActive']) : TransformObject[] {
      return data.map(item => {
        // Crear nuevo objeto con las transformaciones necesarias
        const newObject : TransformObject = { ...item };
        
        // Renombrar code a id
        if (newObject.hasOwnProperty('equipmentTypeCode')) {
          newObject['id'] = newObject['equipmentTypeCode'];
          delete newObject['equipmentTypeCode'];
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
  
    async createEquipmentType(newEquipmentType : EquipmentType) : Promise<EquipmentType> {
  
      let body = {
        equipmentTypeCode: newEquipmentType.equipmentTypeCode,
        name: newEquipmentType.name,
        description: newEquipmentType.description,
        isActive: true
      };
  
      return new Promise<EquipmentType>((resolve,reject)=>{
        this.httpResquestService.post<EquipmentType>(equipmentMicroService,AdminEndpoints.EQUIPMENT_TYPE,body)
          .then((data:EquipmentType) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async deleteEquipmentType(equipmentTypeId: string) : Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.httpResquestService.delete<void>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_TYPE}/${equipmentTypeId}`)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async updateEquipmentType(equipmentTypeId: string, equipmentType : EquipmentType) : Promise<EquipmentType> {
      let body = {
        name: equipmentType.name,
        description: equipmentType.description,
        isActive: equipmentType.isActive
      };
      
      return new Promise<EquipmentType>((resolve, reject) =>{
        this.httpResquestService.put<EquipmentType>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_TYPE}/${equipmentTypeId}`,body)
          .then((data:EquipmentType) => resolve(data))
          .catch(err => reject(err));
      });
    }

    async getEquipmentTypeById(equipmentTypeId : string) : Promise<EquipmentType>{
      return new Promise<EquipmentType>((resolve, reject) =>{
        this.httpResquestService.get<EquipmentType>(equipmentMicroService,`${AdminEndpoints.EQUIPMENT_TYPE}/${equipmentTypeId}`,)
          .then((data:EquipmentType) => resolve(data))
          .catch(err => reject(err));
      });
    }
}
