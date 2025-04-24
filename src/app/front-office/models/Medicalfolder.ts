export interface MedicalFolder {
    id: number; 
    patientName: string;
    patientEmail?: string;
    patientPhone?: string;
    birthDate: Date;
    gender: string ;
  
    // Consultation info
    
    
    reasonForVisit: string; // ex: perte de poids, diabète, etc.
    notes: string;
  
    // Suivi nutritionnel
    weight: number; // en kg
    height: number; // en cm
    bmi?: number; // calculé
    allergies?: string;
    medicalHistory?: string;
  
    // Programme recommandé
    
  
    createdAt: Date;
    updatedAt?: Date;
  }
  