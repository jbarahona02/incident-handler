export interface EquipmentLocation {
    equipmentLocationId: number;
    name: string;
    assignedUser: number;
    isHighSchool: boolean;
    isAdministrative: boolean;
    roomCode: string;
    floor: string;
    isActive: boolean;
}