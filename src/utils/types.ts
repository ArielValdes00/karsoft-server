import { Employee } from "src/employee/entities/employee.entity";
import { User } from "src/user/entities/user.entity";

export interface AuthUserBase {
    id?: number;
    email: string;
    name: string;
    password: string;
    avatar?: string;
}

export interface UserAuth extends AuthUserBase {
    phone_number?: string;
    business_name?: string;
    address?: string;
    postal_code?: string;
}

export interface EmployeeAuth extends AuthUserBase {
    status?: 'activo' | 'inactivo';
    role?: string;
}

export type AuthenticatedUser = 
  | { type: 'user'; user: User } 
  | { type: 'employee'; user: Employee };

