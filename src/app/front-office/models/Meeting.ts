
export interface Meeting {
  id: number;
  patientName: string;
  date: Date;  // correspond à une date complète (date + heure)
  
  status: string;
  notes: string;
}