
export interface UserApp {
    userAppId: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    userTypeCode: string;
    isActive?: boolean;
}