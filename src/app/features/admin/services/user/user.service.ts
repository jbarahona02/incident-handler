import { Injectable } from '@angular/core';
import { UserApp } from '../../../../shared/interfaces/models';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

const userMicroService = ConstantsEndpoints.USER_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private allUsers : UserApp[] = [];
    
  constructor(
    private httpResquestService : HttpRequestService
  ){

  }

  async getAllUsers() : Promise<UserApp[]> {
    return new Promise<UserApp[]>((resolve, reject) => {
      this.httpResquestService.get<UserApp[]>(userMicroService,AdminEndpoints.ALL_USERS)
        .then((data: UserApp[]) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    })
  } 

  transformAndReorder(data : UserApp[], fieldOrder = ['id','name','email','isActive']) : TransformObject[] {
    return data.map(item => {
      // Crear nuevo objeto con las transformaciones necesarias
      const newObject : TransformObject = { ...item };
      
      // Renombrar roleCode a id
      if (newObject.hasOwnProperty('userAppId')) {
        newObject['id'] = newObject['userAppId'];
        delete newObject['userAppId'];
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

  async createUser(userApp : User) : Promise<UserApp> {
    
    let body = {
      name: userApp.name,
      email: userApp.email,
      password: userApp.password,
      userTypeCode : userApp?.userTypeCode,
    };

    return new Promise<UserApp>((resolve,reject) => {
      this.httpResquestService.post<UserApp>(userMicroService,AdminEndpoints.USER,body)
        .then((data:UserApp)=>{
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async deleteUser(userAppId: string) : Promise<void> {
    return new Promise<void>((resolve,reject)=>{
      this.httpResquestService.delete(userMicroService,`${AdminEndpoints.USER}/${userAppId}`)
        .then(()=>{
          resolve();
        })
        .catch(err =>{
          reject(err);
        })
    });
  }

  async updateUser(userAppId: number, userApp : User) : Promise<UserApp> {
    let body = {
      name: userApp.name,
      email: userApp.email,
      userTypeCode : userApp?.userTypeCode,
      isActive: userApp?.isActive
    };
    
    return new Promise<UserApp>((resolve,reject)=>{
      this.httpResquestService.put<UserApp>(userMicroService,`${AdminEndpoints.USER}/${userAppId}`,body)
        .then((data:UserApp) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        });
    });
  }

  async getUserTypeByEmail(email: string) : Promise<UserApp>{
    return new Promise<UserApp>((resolve, reject)=>{
      this.httpResquestService.get<UserApp>(userMicroService,`${AdminEndpoints.USER}/${email}`)
        .then((data:UserApp) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  }
}

interface User {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  userTypeCode: string;
}