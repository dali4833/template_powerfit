
export interface Meeting {
  id: number ;
  patientName: string;
  date: Date | string;  // correspond à une date complète (date + heure)
  
  status: string;
  notes: string;
  dossierId ?: number; 
}