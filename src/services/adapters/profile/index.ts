import type { ProfileResponse } from './types';
import type { Profile } from '@/types/session';

export const adaptProfile = (data: ProfileResponse = {
  name: '',
  lastName: '',
  height: 0,
  weight: 0,
  bodyMassIndex: 0,
  preferredEquipment: '',
  goals: [],
  physicalState: '',
  gender: '',
  level: '',
  tenant: {
    name: '',
    email: ''
  }
}): Profile => ({
  name: data.name,
  lastName: data.lastName,
  height: data.height,
  weight: data.weight,
  bodyMassIndex: data.bodyMassIndex,
  preferredEquipment: data.preferredEquipment,
  goals: data.goals,
  physicalState: data.physicalState,
  gender: data.gender,
  level: data.level,
  tenant: {
    name: data.tenant.name,
    email: data.tenant.email
  }
});
