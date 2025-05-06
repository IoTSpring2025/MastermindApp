export interface Game {
  id: string;
  players: string[];
  playerHand: {
    value: string[];
    suit: string[];
  };
  flop: string[];
  turn: string;
  river: string;
  win: boolean;
  createdAt: Date;
  advice: {
    flop: string;
    turn: string;
    river: string;
  };
}