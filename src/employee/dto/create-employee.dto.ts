export class CreateEmployeeDto {
    name: string;
    email: string;
    status: 'activo' | 'inactivo'; 
    role: string;
}
