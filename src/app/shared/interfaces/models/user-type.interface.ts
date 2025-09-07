import { Role } from ".";

export interface UserType {
    userTypeCode: string;
    name: string;
    description: string;
    roleCode: string;
    isActive?: boolean;
    role?: Role
}