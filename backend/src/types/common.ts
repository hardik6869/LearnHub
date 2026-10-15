// Route params shared by several controllers

export interface IdParams {
  id: string;
}

// Present when a router is mounted under /academies/:academyId
export interface AcademyParams {
  academyId?: string;
}

// ObjectId references as they arrive in request bodies and seed files
export interface RefIds {
  academy?: string;
  user?: string;
}
