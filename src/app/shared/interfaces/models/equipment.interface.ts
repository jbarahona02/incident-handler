export interface Equipment {
    equipmentId: number;
    name: string;
    equipmentTypeCode: string;
    brand: string;
    color: string;
    serialNumber: string;
    model: string;
    equipmentLocationId: number;
    warrantyExpiredDate: Date;
    isWarrantyExpired: boolean;
    isActive: boolean;
}