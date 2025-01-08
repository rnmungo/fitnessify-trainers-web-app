export interface ProfileResponse {
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
