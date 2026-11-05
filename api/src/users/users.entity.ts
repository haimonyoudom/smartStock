export interface User {     
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'OWNER' | 'CASHIER';
    active: boolean;
}