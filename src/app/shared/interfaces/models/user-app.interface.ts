import { UserType } from "./user-type.interface";

export interface UserApp {
    userAppId: number;
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userType?: UserType;
    isActive?: boolean;
}