export interface User {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface LoginState {
  currentUser: User | null;
  expoPushToken: string;
}
