export class VerificationSeal {
  constructor(
    private _id: string,
    private _user_id: string,
    private _is_verified: boolean,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._user_id;
  }

  get is_verified(): boolean {
    return this._is_verified;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  verify() {
    this._is_verified = true;
  }

  unverify() {
    this._is_verified = false;
  }
}