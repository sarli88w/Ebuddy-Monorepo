export type Credential = {
  username: string;
  password: string;
}

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: number;
  auth_time?: number;
  auth_exp?: number;
}

export interface UserState {
  data: User | null;
  token: string | null;
  isAuthenticated: boolean,
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}
