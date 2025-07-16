export interface CreateVerificationSealDTO {
  user_id: string;
}

export interface UpdateVerificationSealDTO {
  user_id: string;
  is_verified: boolean;
}