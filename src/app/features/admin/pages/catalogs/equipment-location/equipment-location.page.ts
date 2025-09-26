import { ChangeDetectorRef, Component } from '@angular/core';
import { CheckboxInputComponent, DataTableComponent, SelectInputComponent, TextInputComponent } from '../../../../../shared/components';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipmentLocation, UserApp } from '../../../../../shared/interfaces/models';
import { TransformObject } from '../../../../../shared/interfaces';
import { MessageService } from '../../../../../shared/services/message-service/message.service';
import { UserService } from '../../../services/user/user.service';
import { EquipmentLocationService } from '../../../services/equipment-location/equipment-location.service';
import { noWhitespaceValidator } from '../../../../../shared/utils/common-functions';

@Component({
  selector: 'app-equipment-location',
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, TextInputComponent, CheckboxInputComponent, SelectInputComponent ],
  templateUrl: './equipment-location.page.html',
  styleUrl: './equipment-location.page.scss'
})
export class EquipmentLocationPage {
  locationForm: FormGroup;

  allTech: UserApp[] = [];
  allLocation: EquipmentLocation[] = [];
  locationsToView : TransformObject[] = [];
  isLoading : boolean = true;
  isAddLocation : boolean = false; 
  isEditLocation : boolean = false;
  // Headers nombre del encabezado de las columnas
  headers: string[] = ['id','Nombre','Código de salón o laboratorio','Edificio','Nivel','Estado'];
  equipmentLocationId : number = 0;

  constructor(
    private formGroup : FormBuilder,
    private changeDetectorRef : ChangeDetectorRef,
    private equipmentLocationService: EquipmentLocationService,
    private messageService : MessageService,
    private userService: UserService
  ){
    this.locationForm = this.formGroup.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
      assignedUser: [null,],
      isBasic: [false],
      isHighSchool: [false ],
      isAdministrative: [false],
      roomCode: ['', [
        Validators.required,
        Validators.maxLength(10),
        noWhitespaceValidator
      ]],
      floor: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ]],
      isActive: [false],
    });
  }

  async ngOnInit() {

    await this.getAllEquipmentLocation();
    this.allTech = (await this.getAllTechs()).filter(tech => tech.isActive);
  }


  async getAllEquipmentLocation(){
    try {
      this.isLoading = true;
      this.allLocation = await this.equipmentLocationService.getAllLocation();
      this.locationsToView = this.equipmentLocationService.transformAndReorder(this.allLocation);
      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
      this.allLocation = [];
    }
  }

  async addLocation() {
      this.isAddLocation = true;

      this.locationForm.get("isBasic")?.valueChanges.subscribe(data => {
        if(data){
          this.locationForm.get("isHighSchool")?.setValue(false);
          this.locationForm.get("isAdministrative")?.setValue(false);
        }
      });

      this.locationForm.get("isHighSchool")?.valueChanges.subscribe(data => {
        if(data){
          this.locationForm.get("isBasic")?.setValue(false);
          this.locationForm.get("isAdministrative")?.setValue(false);
        }
      });

      this.locationForm.get("isAdministrative")?.valueChanges.subscribe(data => {
        if(data){
          this.locationForm.get("isBasic")?.setValue(false);
          this.locationForm.get("isHighSchool")?.setValue(false);
        }
      });
  }

  async editEquipmentLocation(object : TransformObject){
    
    try {
      let equipmentLocation = await this.equipmentLocationService.getEquipmentLocationById(object['id']);
      this.equipmentLocationId = equipmentLocation.equipmentLocationId;
      this.locationForm.setValue({
        name: equipmentLocation.name || '',
        assignedUser: equipmentLocation.assignedUser || '1',
        isBasic: !equipmentLocation.isAdministrative && !equipmentLocation.isHighSchool || false,
        isHighSchool: equipmentLocation.isHighSchool || false,
        isAdministrative: equipmentLocation.isAdministrative || false,
        roomCode: equipmentLocation.roomCode || 'CA',
        floor: equipmentLocation.floor,
        isActive: equipmentLocation.isActive || true,
      });

      this.isEditLocation = true;

      this.changeDetectorRef.detectChanges();
    } catch(err) {

    }

  }

  async deleteEquipmentLocation(object : TransformObject){
    try {
      this.isLoading = true;
      await this.equipmentLocationService.deleteEquipmentLocation(object['id']);
      this.messageService.showSuccess("Ubicación eliminada con éxito.","Ubicación");
      await this.getAllEquipmentLocation();
      this.isLoading = false;
    } catch(err) {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.locationForm.valid) {
      try {
        this.isLoading = true;
  
        if(this.isAddLocation) {
          await this.equipmentLocationService.createEquipmentLocation(this.locationForm.value);
          this.messageService.showSuccess("Ubicación agregada con éxito.","Ubicación");
        } else {
           await this.equipmentLocationService.updateEquipmentLocation(this.equipmentLocationId,this.locationForm.value);
           this.messageService.showSuccess("Ubicación actualizada con éxito.","Ubicación");
        }
        
        this.isLoading = false;
        await this.getAllEquipmentLocation();
        this.cleanValuesOfForm();
        this.isAddLocation = false;
        this.isEditLocation = false;
      } catch(err) {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.locationForm);
    }
  }

  onCancel(): void {
    this.isAddLocation = false;
    this.isEditLocation = false;
    this.cleanValuesOfForm();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cleanValuesOfForm(){
    this.locationForm.reset({
      assignedUser: ''
    });
  }

  ngOnChanges() {
    const isActiveControl = this.locationForm.get('isActive');
    if (isActiveControl) {
      if (this.isAddLocation) {
        isActiveControl.disable();
      } else {
        isActiveControl.enable();
      }
    }
  }

  async getAllTechs() : Promise<UserApp[]> {
    try{
     return this.userService.getAllTech();
    } catch(err){
      return [];
    }
  }
}
