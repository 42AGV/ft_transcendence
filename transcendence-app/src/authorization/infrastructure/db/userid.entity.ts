export interface UserIdData {
  id: string;
}
export class UserId {
  id: string;
  constructor(userData: UserIdData) {
    this.id = userData.id;
  }
}
