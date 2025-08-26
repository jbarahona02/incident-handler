import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


interface Record {
  id: number;
  nombre: string;
  fechaCreacion: Date;
  usuario: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  acciones: string;
}

@Component({
  selector: 'app-opcion2-admin.page',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './opcion2-admin.page.html',
  styleUrl: './opcion2-admin.page.scss'
})


export class Opcion2AdminPage {
   isMobile = window.innerWidth < 768;
   records: Record[] = [
    {
      id: 1,
      nombre: 'Informe Trimestral Q1',
      fechaCreacion: new Date('2023-01-15'),
      usuario: 'Juan Pérez',
      estado: 'activo',
      acciones: ''
    },
    {
      id: 2,
      nombre: 'Auditoría de Seguridad',
      fechaCreacion: new Date('2023-02-20'),
      usuario: 'María Gómez',
      estado: 'pendiente',
      acciones: ''
    },
    {
      id: 3,
      nombre: 'Actualización de Políticas',
      fechaCreacion: new Date('2023-03-10'),
      usuario: 'Carlos Ruiz',
      estado: 'inactivo',
      acciones: ''
    },
    {
      id: 4,
      nombre: 'Backup Base de Datos',
      fechaCreacion: new Date('2023-04-05'),
      usuario: 'Ana López',
      estado: 'activo',
      acciones: ''
    },
    {
      id: 5,
      nombre: 'Migración a Nueva Plataforma',
      fechaCreacion: new Date('2023-05-12'),
      usuario: 'Pedro Martínez',
      estado: 'pendiente',
      acciones: ''
    }
  ];

  constructor(){
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }
  getStatusClass(status: string): string {
    return {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'pendiente': 'bg-yellow-100 text-yellow-800'
    }[status] || '';
  }

  editIncident(id: number) {
  // Lógica para editar el incidente
    console.log('Editar incidente:', id);
    //this.router.navigate(['/incidentes/editar', id]);
  }

  deleteIncident(id: number) {
    // Lógica para eliminar el incidente
    if (confirm('¿Estás seguro de que deseas eliminar este incidente?')) {
      console.log('Eliminar incidente:', id);
      // Aquí iría tu llamada al servicio para eliminar
    }
  }
}
