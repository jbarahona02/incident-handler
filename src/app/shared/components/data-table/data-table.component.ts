import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TransformObject } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  imports: [ CommonModule ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DataTableComponent implements OnChanges {

  @Input() headers : string[] = [];
  @Input() data : TransformObject[] = [];
  @Input() title : string = "";
  @Output() clickOnAdd : EventEmitter<void> = new EventEmitter<void>();
  @Output() clickOnEdit : EventEmitter<TransformObject> = new EventEmitter<TransformObject>();
  @Output() clickOnDelete : EventEmitter<TransformObject> = new EventEmitter<TransformObject>();
  columns : string[] = [];
  isMobile : boolean = window.innerWidth < 768;

  constructor(
    private changeDetectorRef : ChangeDetectorRef
  ){
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      // Aquí puedes procesar los datos si es necesario
      this.changeDetectorRef.detectChanges();
    }
  }

  getStatusClass(status: string): string {
    return {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'pendiente': 'bg-yellow-100 text-yellow-800'
    }[status] || '';
  }

  addRecord(){
    this.clickOnAdd.emit();
  }

  editRecord(object : TransformObject) {
    this.clickOnEdit.emit(object);
  }


  deleteRecord(object : TransformObject) {
    this.clickOnDelete.emit(object);
  }

  // Función para obtener las keys de un objeto
  getKeys(obj: TransformObject): string[] {
    return Object.keys(obj);
  }
}
