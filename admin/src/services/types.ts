export interface CleaningProject {
  siteId: number;
  plantCode: string;
  projectName: string;
  address: string;
  systemSizeKWp: number;
  pvModuleEA: number | null;
  contactPhone?: string; 
  contactEmail?: string; 
}


export interface InspectionProject {
  siteId: number;
  plantCode: string;
  projectName: string;
  address: string;
  systemSizeKWp: number;
  contactPhone?: string; 
  contactEmail?: string; 
}

