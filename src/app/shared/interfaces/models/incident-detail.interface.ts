import { IncidentDetailStatus } from "./incident-detail-status.interface";

export interface IncidentDetail {
    incidentDetailId: number;
    description: string;
    incidentId: number;
    equipmentId: number;
    equipmentLocationId: number;
    technicianUserAppId: number;
    incidentDetailStatus: IncidentDetailStatus;
    createdAt: string;
    updatedAt: string;
}