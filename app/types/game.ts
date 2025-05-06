export interface Game {
  id: string;
  player_id: string;
  playerHand?: {
    key: string;
    value: string[];
  };
  flop?: string[];
  turn?: string;
  river?: string;
  win?: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  advice?: {
    flop: string;
    turn: string;
    river: string;
  };
}