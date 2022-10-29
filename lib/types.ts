export type LogStates = {
  [logName: string]: CurrentState;
};
export type FullLogStates = {
  [logName: string]: FullCurrentState;
};
export interface CurrentState {
  updatedAt: Date;
  logname: string;
  users: { [id: string]: LogUser };
}
export interface FullCurrentState extends Omit<CurrentState, "users"> {
  users: { [id: string]: FullUser };
}
export type LogUser = {
  id: number;
  name: string;
  experience: number;
  level: number;
};
export type FullUser = LogUser & { rank: number };

export type Ranking = {
  [logName: string]: Ranks;
};
export type Ranks = {
  [rank: string]: [id: string];
};
