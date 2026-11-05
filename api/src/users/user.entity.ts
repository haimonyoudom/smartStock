export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'CASHIER';
  active: boolean;
}

export type StoredUser = User & { password: string };