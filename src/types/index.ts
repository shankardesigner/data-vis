export interface Attribute {
  id: number;
  [key: string]: any;
}


// types.ts

export interface NodeType {
  id: number;
  name: string;
  role: string;
  specialty?: string | null;
  patient_count?: number | null;

  // Required for D3 simulation
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface LinkType {
  source: number | string;
  target: number | string;
  interaction_type: string;
  date: string;
}
