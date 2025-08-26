import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavItem } from '../../interfaces';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class Sidebar {
  
  navItems : NavItem[] = [];
  isMobileMenuOpen = false;
  isMobileView = false;


  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
    // Cierra el menú si cambia a vista desktop
    if (!this.isMobileView && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  constructor(private route: ActivatedRoute){
    
  }

  ngOnInit() {
    console.log("Datos: ", this.route);
    this.navItems = this.route.snapshot.data['navItems'] || [];
    console.log("Opciones:", this.navItems);
    
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 1024;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
