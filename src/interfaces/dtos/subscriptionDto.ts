export interface SubscriptionDTO {
  id: string;
  user_id: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'expired';
  created_at: Date;
  expires_at: Date;
}