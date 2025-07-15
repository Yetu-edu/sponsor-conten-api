export type SponsoredContentType = 'badge' | 'post';

export class SponsoredContent {
  constructor(
    public readonly id: string,
    public user_id: string,
    public type: SponsoredContentType,
    public content: string,
    public start_date: Date,
    public end_date: Date,
    public status: 'active' | 'inactive',
  ) {}

  isActive(): boolean {
    return this.status === 'active' && new Date() < this.end_date;
  }

  expire() {
    this.status = 'inactive';
  }
}