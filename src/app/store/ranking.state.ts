import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { BracketNode, UserSession } from '../core/models';
import { QuizService } from '../core/services/quiz';
import { LoadRankings, ResetRankings } from './ranking.actions';

export interface RankingStateModel {
  participants: UserSession[];
  bracket: BracketNode[];
  loading: boolean;
}

@State<RankingStateModel>({
  name: 'ranking',
  defaults: { participants: [], bracket: [], loading: false }
})
@Injectable()
export class RankingState {
  constructor(private quizService: QuizService) {}

  @Selector() static bracket(s: RankingStateModel) { return s.bracket; }
  @Selector() static participants(s: RankingStateModel) { return s.participants; }
  @Selector() static loading(s: RankingStateModel) { return s.loading; }

  @Action(LoadRankings)
  async load(ctx: StateContext<RankingStateModel>, { quizId }: LoadRankings) {
    ctx.patchState({ loading: true });
    const participants = await this.quizService.getParticipants(quizId);
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    const bracket = this.buildBracket(sorted);
    ctx.patchState({ participants: sorted, bracket, loading: false });
  }

  @Action(ResetRankings)
  reset(ctx: StateContext<RankingStateModel>) {
    ctx.setState({ participants: [], bracket: [], loading: false });
  }

  private buildBracket(sorted: UserSession[]): BracketNode[] {
    return sorted.map((p, i) => ({
      rank: i + 1,
      name: p.name,
      score: p.score,
      totalQuestions: p.totalQuestions
    }));
  }
}
