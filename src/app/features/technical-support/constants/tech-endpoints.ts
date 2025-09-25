const microServiceIncident: string = "incident"

export const TechEndpoints = {
    INCIDENT: `${microServiceIncident}`,
    TO_REVISION_STATUS: `${microServiceIncident}/detail/to-revision`,
    TO_FIX_STATUS: `${microServiceIncident}/detail/to-fix`,
    TO_FIXED_STATUS: `${microServiceIncident}/detail/to-fixed`,
    TO_FINISHED_STATUS: `${microServiceIncident}/detail/to-finished`,
}