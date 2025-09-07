import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { Role } from '../../../../shared/interfaces/models';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';

const userMicroService = ConstantsEndpoints.USER_MICROSERVICE;
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private allRole : Role[] = [];

  constructor(
    private httpResquestService : HttpRequestService
  ){

  }

  async getAllRoles() : Promise<Role[]> {
    return new Promise<Role[]>((resolve,reject)=>{
      this.httpResquestService.get<Role[]>(userMicroService,AdminEndpoints.ALL_ROLES)
        .then((data:Role[]) =>{
          resolve(data);
        })
        .catch(err =>{
          reject(err);
        })
    });
  } 

  transformAndReorder(data : Role[], fieldOrder = ['id','name','description','isActive']) : TransformObject[] {
    return data.map(item => {
      // Crear nuevo objeto con las transformaciones necesarias
      const newObject : TransformObject = { ...item };
      
      // Renombrar roleCode a id
      if (newObject.hasOwnProperty('roleCode')) {
        newObject['id'] = newObject['roleCode'];
        delete newObject['roleCode'];
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

  async createRole(newRole : Role) : Promise<Role> {

    let body = {
      roleCode : newRole.roleCode,
      name: newRole.name,
      description: newRole.description
    };

    return new Promise<Role>((resolve,reject)=>{
      this.httpResquestService.post<Role>(userMicroService,AdminEndpoints.ROLE,body)
        .then((data:Role) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async deleteRole(roleCode: string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.httpResquestService.delete<void>(userMicroService,`${AdminEndpoints.ROLE}/${roleCode}`)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  async updateRole(roleCode: string, updateRole : Role) : Promise<Role> {
    let body = {
      name: updateRole.name,
      description: updateRole.description,
      isActive: updateRole.isActive
    };
    
    return new Promise<Role>((resolve, reject) =>{
      this.httpResquestService.put<Role>(userMicroService,`${AdminEndpoints.ROLE}/${roleCode}`,body)
        .then((data:Role) => resolve(data))
        .catch(err => reject(err));
    });
  }
}
