export type SponsoredContentType = 'curso' | 'video' | 'mentoria' | 'produto' | 'bolsa' | 'paper' | 'ticket' | 'flick';
export interface Filters {
  area_of_study: string;
  interest: string[];
  localization: string;
  curse: string;
  academic_level: string;
}

export class SponsoredContent {
  private status: 'active' | 'inactive' = 'active';
  private created_at: Date;
  private updated_at: Date;

  constructor(
    private readonly id: string,
    private ref_content: string,
    private type_content: SponsoredContentType,
    private price_per_day: number,
    private days: number,
    private start_date: Date,
    private end_date: Date,
    private filters: Filters
  ) {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // ========== GETTERS ==========

  getId(): string {
    return this.id;
  }

  getContentId(): string {
    return this.ref_content;
  }

  getType(): SponsoredContentType {
    return this.type_content;
  }

  getPricePerDay(): number {
    return this.price_per_day;
  }

  getDays(): number {
    return this.days;
  }

  getTotalPrice(): number {
    return this.price_per_day * this.days;
  }

  getStartDate(): Date {
    return this.start_date;
  }

  getEndDate(): Date {
    return this.end_date;
  }

  getFilters(): Filters {
    return this.filters;
  }

  getStatus(): 'active' | 'inactive' {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.created_at;
  }

  getUpdatedAt(): Date {
    return this.updated_at;
  }

  // ========== SETTERS & BUSINESS LOGIC ==========

  extendDays(extraDays: number): void {
    this.days += extraDays;
    this.end_date = new Date(this.end_date.getTime());
    this.end_date.setDate(this.end_date.getDate() + extraDays);
    this.updated_at = new Date();
  }

  updateFilters(newFilters: Filters): void {
    this.filters = newFilters;
    this.updated_at = new Date();
  }

  isActive(): boolean {
    return this.status === 'active' && new Date() < this.end_date;
  }

  expire(): void {
    this.status = 'inactive';
    this.updated_at = new Date();
  }

  reactivate(newDays: number): void {
    if (this.status === 'inactive') {
      this.status = 'active';
      this.days = newDays;
      this.start_date = new Date();
      this.end_date = new Date();
      this.end_date.setDate(this.start_date.getDate() + newDays);
      this.updated_at = new Date();
    }
  }
}