export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // facultatif pour ne pas l'exposer inutilement côté frontend
  roles: string;
  user_type: 'COACH' | 'NUTRITIONIST' | 'USER' | 'ClubOwner' | 'ADMIN';
  status: string;
}