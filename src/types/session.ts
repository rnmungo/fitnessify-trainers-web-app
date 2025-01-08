export type Authorization = {
  expires: number;
  issuedAt: number;
  refreshToken?: string;
  token: string;
};

export type User = {
  id: string;
  email: string;
  roles: string[];
  tenant: string;
};

export type Profile = {
  name: string;
  lastName: string;
  height: number;
  weight: number;
  bodyMassIndex: number;
  preferredEquipment: string;
  goals: Array<string>;
  physicalState: string;
  gender: string;
  level: string;
  tenant: {
    name: string;
    email: string;
  };
};

export type BaseSession = {
  applicationId: string;
  isLoggedIn: boolean;
  authorization: Authorization;
  user: User;
};

export type ProfileSession = {
  profile: Profile;
};

export type Session = BaseSession & ProfileSession;
