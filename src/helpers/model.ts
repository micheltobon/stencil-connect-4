export enum chip{
  red = 'red',
  blue = 'blue',
}

export type boardPosition = null | chip;

export interface boardCoordinate {
  COL: number;
  ROW: number;
}

export interface NextWinner {
  winner?: chip;
  winningVector?: boardCoordinate[]
}
