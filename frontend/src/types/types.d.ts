import { UserRole } from "./auth";

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
