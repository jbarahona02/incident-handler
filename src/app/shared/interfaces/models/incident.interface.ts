import { IncidentDetail } from "./incident-detail.interface";
import { IncidentPriorityLevel } from "./incident-priority-level.interface";
import { IncidentType } from "./incident-type.interface";

export interface Incident {
  incidentId: number;
  description: string;
  incidentType: IncidentType;
  locationId: string;
  incidentPriorityLevel: IncidentPriorityLevel;
  reportUserAppId: number;
  reportedDate: string;
  isCompleted: boolean;
  inProgress: boolean;
  completedDate: string;
  incidentDetails: IncidentDetail[];
}
