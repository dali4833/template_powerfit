import { User } from '../models/User';
export class DietProgram {
  idDiet!: number;
  name!: string;
  description!: string;
  calories!: number;
  duration!: number; 
  targetGoal!: string; 
  creationDate?: Date;
  user?: User; 
}
export interface DietProgramRequest {
  idDiet: number;
  name: string;
  description: string;
  calories: number;
  duration: number;
  targetGoal: string;
  creationDate: string;
  userUsername?: string;
  userEmail?: string;
}

