export enum PRIORITIES {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM', 
    HIGH = 'HIGH'
}

export enum INCIDENT_STATUS {
    OPEN = "Abierto",
    ASSIGNED = "Asignado",
    IN_PROGRESS = "En progreso",
    DONE = "Resuelto"
}

export enum ROLES {
    ADMIN = "ADMIN",
    REPORTER = "REPORTER",
    TECHNICAL_SUPPORT = "TECH"
}

export enum INCIDENT_FLOW {
    'PEDIENTE_ASIGNACION' = 'PEN_ASG',
    'ASIGNADO' = 'ASG',
    'EN_REVISION' = 'REV',
    'EN_REPARACION' = 'REP',
    'REPARADO' = 'REPA',
    'FINALIZADO' = 'FIN'
}