export interface SubscriptionProps {
  user_id: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'expired';
  created_at?: Date;
  expires_at: Date;
}

export class Subscription {
  private props: SubscriptionProps;
  public readonly id?: string;

  constructor(props: SubscriptionProps, id?: string) {
    this.props = {
      ...props,
      created_at: props.created_at ?? new Date()
    };
    this.id = id;
  }

  get user_id() {
    return this.props.user_id;
  }

  get plan() {
    return this.props.plan;
  }

  get status() {
    return this.props.status;
  }

  get created_at() {
    return this.props.created_at!;
  }

  get expires_at() {
    return this.props.expires_at;
  }

  set plan(plan: SubscriptionProps['plan']) {
    this.props.plan = plan;
  }

  set status(status: SubscriptionProps['status']) {
    this.props.status = status;
  }

  set expires_at(date: Date) {
    this.props.expires_at = date;
  }

  isActive(): boolean {
    return this.props.status === 'active' && this.props.expires_at > new Date();
  }

  expire(): void {
    this.props.status = 'expired';
  }
}