import { Injectable } from '@angular/core';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { UserType } from '../../../../shared/interfaces/models';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

const userMicroService = ConstantsEndpoints.USER_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})

export class UserTypeService {
  
    private allUserType : UserType[] = [];
  
    constructor(
      private httpResquestService : HttpRequestService
    ){
  
    }
  
    async getAllUserType() : Promise<UserType[]> {
      return new Promise<UserType[]>((resolve, reject) => {
        this.httpResquestService.get<UserType[]>(userMicroService,AdminEndpoints.ALL_USER_TYPE)
          .then((data: UserType[]) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      })
    } 
  
    transformAndReorder(data : UserType[], fieldOrder = ['id','name','description','isActive','roleCode']) : TransformObject[] {
      return data.map(item => {
        // Crear nuevo objeto con las transformaciones necesarias
        const newObject : TransformObject = { ...item };
        
        // Renombrar roleCode a id
        if (newObject.hasOwnProperty('userTypeCode')) {
          newObject['id'] = newObject['userTypeCode'];
          delete newObject['userTypeCode'];
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
  
    async createUserType(newUserType : UserType) : Promise<UserType> {
  
      let body = {
        userTypeCode : newUserType.userTypeCode,
        name: newUserType.name,
        description: newUserType.description,
        roleCode: newUserType.roleCode
      };
  
      return new Promise<UserType>((resolve,reject) => {
        this.httpResquestService.post<UserType>(userMicroService,AdminEndpoints.USER_TYPE,body)
          .then((data:UserType)=>{
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      });
    }
  
    async deleteUserType(userTypeCode: string) : Promise<void> {
      return new Promise<void>((resolve,reject)=>{
        this.httpResquestService.delete(userMicroService,`${AdminEndpoints.USER_TYPE}/${userTypeCode}`)
          .then(()=>{
            resolve();
          })
          .catch(err =>{
            reject(err);
          })
      });
    }
  
    async updateUserType(userTypeCode: string, userType : UserType) : Promise<UserType> {
      let body = {
        name: userType.name,
        description: userType.description,
        roleCode: userType.roleCode,
        isActive: userType.isActive,
      };
      
      return new Promise<UserType>((resolve,reject)=>{
        this.httpResquestService.put<UserType>(userMicroService,`${AdminEndpoints.USER_TYPE}/${userTypeCode}`,body)
          .then((data:UserType) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          });
      });
    }

    async getUserTypeByCode(userTypeCode: string) : Promise<UserType>{
      return new Promise<UserType>((resolve, reject)=>{
        this.httpResquestService.get<UserType>(userMicroService,`${AdminEndpoints.USER_TYPE}/${userTypeCode}`)
          .then((data:UserType) =>{
            resolve(data);
          })
          .catch(err =>{
            reject(err);
          })
      });
    }
}
