export interface CreateUserDTO {
  user_ref: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}