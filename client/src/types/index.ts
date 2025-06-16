export interface Log {
  user?: { email: string };
  method: string;
  originalUrl: string;
  statusCode: number;
  timestamp: string;
  isEnabled?: boolean;
  isWhitelisted?: boolean;
}
export interface FetchedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface User {
  email: string;
  userId: string;
  name: string;
}

export interface AuthContextType {
  userId: string | null;
  email: string | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
