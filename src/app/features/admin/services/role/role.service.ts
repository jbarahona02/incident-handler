import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { Role } from '../../../../shared/interfaces/models';
import { AdminEndpoints } from '../../constants/admin-endpoints';
import { TransformObject } from '../../../../shared/interfaces';

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
      return await this.httpResquestService.get(AdminEndpoints.ALL_ROLES);
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
    return await this.httpResquestService.post(AdminEndpoints.CREATE_ROLE,{...newRole});
  }
}
