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
    try {
      return await this.httpResquestService.get(userMicroService,AdminEndpoints.ALL_ROLES);
    } catch (err) {
      return [];
    }
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

  async createRole(newRole : Role) {

    let body = {
      roleCode : newRole.roleCode,
      name: newRole.name,
      description: newRole.description
    };

    return await this.httpResquestService.post(userMicroService,AdminEndpoints.ROLE,body);
  }

  async deleteRole(roleCode: string) {
    return await this.httpResquestService.delete(userMicroService,`${AdminEndpoints.ROLE}/${roleCode}`);
  }

  async updateRole(roleCode: string, updateRole : Role) {
    let body = {
      name: updateRole.name,
      description: updateRole.description,
      isActive: updateRole.isActive
    };
    
    return await this.httpResquestService.put(userMicroService,`${AdminEndpoints.ROLE}/${roleCode}`,body);
  }
}
