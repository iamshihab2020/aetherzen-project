export type UserRole = "HOSPITAL_ADMIN" | "DOCTOR" | "PATIENT";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// For public registration, role is not accepted from UI
export interface RegisterCredentials {
  name?: string;
  email: string;
  password: string;
}
