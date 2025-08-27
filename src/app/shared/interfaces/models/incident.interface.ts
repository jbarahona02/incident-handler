export interface Incident {
  incidentId: string;
  description: string;
  incidentTypeCode: string;
  locationId: string;
  incidentPriorityLevelCode: string;
  reportUserAppId: number;
  reportedDate: Date;
  isCompleted: boolean;
  inProgress: boolean;
  completedDate: Date;
}
