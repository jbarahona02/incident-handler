export interface IncidentDetailStatus {
    incidentDetailStatusCode: 'PEN_ASG' | 'ASG' | 'REV' | 'REP' | 'REPA' | 'FIN';
    name: string;
    description: string;
}