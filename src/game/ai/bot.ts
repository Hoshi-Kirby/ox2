import { Bot } from "boardgame.io/ai";

export class MyBot extends Bot {
  play({ G, ctx }: { G: any; ctx: any }, playerID: string) {
    const actions = this.enumerate(G, ctx, playerID);

    if (actions.length === 0) {
      return new Promise<{
        action: any;
        metadata?: any;
      }>(() => {});
    }

    return Promise.resolve({
      action: this.random(actions),
    });
  }
}
