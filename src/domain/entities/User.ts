export class User {
  constructor(
    public readonly id: string,
    public user_ref: string,
    public email: string,
    public password: string,
    public readonly created_at: Date = new Date()
  ) {}
}