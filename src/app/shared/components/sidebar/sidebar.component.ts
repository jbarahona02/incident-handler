import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../interfaces';
import { MenuOptionService } from '../../services/menu-option/menu-option.service';
import { AuthService } from '../../../features/authentication/services/auth/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class Sidebar implements OnInit {
  
  navItems: NavItem[] = [];
  isMobileMenuOpen = false;
  isMobileView = false;
  isLoading = true;

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
    if (!this.isMobileView && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private menuOptionService: MenuOptionService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Primero intenta obtener los items desde la ruta (fallback)
    const routeItems = this.route.snapshot.data['navItems'] || [];
    const roleCode : string  = this.route.snapshot.data['role'];
    
    try {
      // Obtener items desde API usando Promesas
      const apiItems = await this.menuOptionService.getMenuItems(roleCode);
  
      if (apiItems && apiItems.length > 0) {
        this.navItems = apiItems;
      } else {
        // Si no hay items de la API, usar los de la ruta
        this.navItems = [];
      }
    } catch (error) {
      // En caso de error, usar items de la ruta
      this.navItems = [];
    } finally {
      this.isLoading = false;
      this.checkViewport();
    }
  }

  toggleSubMenu(item: NavItem) {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  hasActiveChild(item: NavItem): boolean {
    if (!item.children) return false;
    
    return item.children.some(child => 
      this.router.url.includes(child.path)
    );
  }

  navigateTo(item: NavItem, event: Event) {
    if (item.children && item.children.length > 0) {
      // Solo toggle para items con hijos, no navegar
      event.preventDefault();
      event.stopPropagation();
      this.toggleSubMenu(item);
    } else if (this.isMobileView) {
      // Para items sin hijos, navegar y cerrar menú en móvil
      this.isMobileMenuOpen = false;
    }
    // Para items sin hijos en desktop, el routerLink se encarga
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 1024;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeSession(){
    this.authService.clearAuthData();
    this.router.navigate(["authentication"]);
  }
}