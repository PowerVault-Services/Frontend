export interface Plant {
  id: number;
  name: string;
  capacityMW: number;
  location: string;
}

export interface ForecastRow {
  plantId: number;
  month: string;
  irradiation: number;
  production: number;
  pr: number;
}