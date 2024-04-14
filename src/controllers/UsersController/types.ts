import { UserRole } from "../../types";

export interface ICreateUserData {
  password: string;
  phone: string;
  email: string;
  login: string;
  role: UserRole;
}

export interface ITokenData {
  email?: string;
  password?: string;
  id?: number;
  exp?: number;
}
