
const microServiceUser : string = "user";
const microServiceIncident: string = "incident"
const microServiceEquipment: string = "equipment";

export const AdminEndpoints = {
    ALL_ROLES : `${microServiceUser}/role-all`,
    ROLE : `${microServiceUser}/role`,
    ALL_USER_TYPE: `${microServiceUser}/type-all`,
    USER_TYPE: `${microServiceUser}/type`,
    ALL_INCIDENT_TYPES: `${microServiceIncident}/type-list`,
    INCIDENT_TYPES: `${microServiceIncident}/type`,
    ALL_INCIDENT_PRIORITY_LEVEL: `${microServiceIncident}/priority-level-list`,
    INCIDENT_PRIORITY_LEVEL: `${microServiceIncident}/priority-level`,
    ALL_USERS : `${microServiceUser}`,
    USER : `${microServiceUser}`,
    EQUIPMENT_LOCATION: `${microServiceEquipment}/equipment-location`,
    EQUIPMENT_TYPE: `${microServiceEquipment}/equipment-type`,
    EQUIPMENT: `${microServiceEquipment}/equipment`
}