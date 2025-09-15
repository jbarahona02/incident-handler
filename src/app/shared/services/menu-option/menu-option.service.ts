import { Injectable } from '@angular/core';
import { NavItem } from '../../interfaces';
import { MenuOption } from '../../interfaces/models';
import { HttpRequestService } from '../http-request/http-request.service';
import { ConstantsEndpoints } from '../../constants/constants-endpoints';

const userMicroService = ConstantsEndpoints.USER_MICROSERVICE;
@Injectable({
  providedIn: 'root'
})
export class MenuOptionService {

  constructor(private httpRequestService: HttpRequestService) { }

  getMenuItems(roleCode: string): Promise<NavItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let menuOptions = await this.httpRequestService.get(userMicroService,`user/menu-options/${roleCode}`) as MenuOption[];
        const activeItems = this.filterActiveItems(menuOptions);
        const navItems = this.convertToNavItems(activeItems);

        resolve(navItems);
      } catch(err){
        reject(err);
      }
    });
  }

  private filterActiveItems(menuOptions: MenuOption[]): MenuOption[] {
    return menuOptions.filter(option => 
      option.isActive
    ).sort((a, b) => {
      const aIsHome = a.menuOptionCode === "HOME";
      const bIsHome = b.menuOptionCode === "HOME";
      
      if (aIsHome && !bIsHome) return -1;
      if (!aIsHome && bIsHome) return 1;
      return 0;
    });
  }

  private convertToNavItems(menuOptions: MenuOption[]): NavItem[] {
    // Obtener items raíz (sin padre)
    const rootItems = menuOptions.filter(option => 
      !option.menuFatherOption || option.menuFatherOption === null
    );

    // Convertir cada item raíz y buscar sus hijos
    return rootItems.map(rootItem => 
      this.convertMenuOptionToNavItem(rootItem, menuOptions)
    );
  }

  private convertMenuOptionToNavItem(menuOption: MenuOption, allOptions: MenuOption[]): NavItem {
    
    // Buscar hijos DIRECTOS en el array de children del item actual
    let children: MenuOption[] = [];
    
    // PRIMERO: Buscar en la propiedad children del item actual
    if (menuOption.children && menuOption.children.length > 0) {
      children = menuOption.children.filter(child => 
        child.isActive
      );
    }
    
    // SEGUNDO: Como fallback, buscar en todo el array (por si children viene vacío pero hay relación por menuFatherOption)
    if (children.length === 0) {
      children = allOptions.filter(option => 
        option.menuFatherOption === menuOption.menuOptionCode &&
        option.isActive
      );
    }

    const icon = this.getIconForMenuCode(menuOption.menuOptionCode);

    const navItem: NavItem = {
      path: this.sanitizePath(menuOption.menuOptionCode),
      label: menuOption.name,
      icon: icon,
      expanded: false
    };

    // Si tiene hijos, convertirlos recursivamente
    if (children.length > 0) {
      navItem.children = children.map(child => 
        this.convertMenuOptionToNavItem(child, allOptions)
      );
    }

    return navItem;
  }

  private sanitizePath(menuCode: string): string {
    // Convertir a minúsculas y reemplazar underscores por guiones
    return menuCode.toLowerCase().replace(/_/g, '-');
  }

  private getIconForMenuCode(menuCode: string): string {
    const iconMap: {[key: string]: string} = {
      'HOME': 'home',
      'DASHBOARD': 'dashboard',
      'ROLES': 'assignment_ind',
      'USERS': 'account_circle', 
      'CATALOGS': 'view_list',
      'USER_TYPES': 'attribution',
      'INCI_TYPES': 'fmd_bad',
      'INCI_LEVEL': 'equalizer',
      'LISTA_INCIDENTES': 'list',
      'NUEVO_INCIDENTE': 'add_circle',
      'USUARIOS': 'people',
      'LISTA_USUARIOS': 'group',
      'CREAR_USUARIO': 'person_add',
      'TEST': 'help',
      'TEST_2': 'help_outline',
      'TEST_3': 'star',
      'CONFIG': 'settings'
    };

    return iconMap[menuCode] || 'help';
  }
}