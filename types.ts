
export interface Wish {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

export interface TimezoneOption {
  value: string;
  label: string;
}

export type ParticleConfig = {
  reduceEffects: boolean;
};
