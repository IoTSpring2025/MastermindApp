export type Game = {
    id: string;
    playerHand?: {
      key: string;
      value: string[];
    };
    flop?: string[];
    turn?: string;
    river?: string;
    win?: boolean;
};