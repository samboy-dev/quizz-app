export class LoadRankings {
  static readonly type = '[Ranking] Load';
  constructor(public quizId: string) {}
}
export class ResetRankings {
  static readonly type = '[Ranking] Reset';
}
