export class Trots {
  data: string = "Trots: No Data.";
}
export interface Tick {
  close: number,
  open: number,
  high: number,
  low: number,
  time: Date
}

export interface SecurityDto {
  name: string,
  data: Tick[]
}
