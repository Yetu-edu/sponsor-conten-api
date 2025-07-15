export interface CreateSponsoredContentDTO {
  user_id: string;
  type: 'badge' | 'post';
  content: string;
  duration_in_days?: number;
}