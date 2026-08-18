import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

/**
 * Achievements router — persistence for the gamerscore system.
 *
 * Client-reported unlocks are accepted by design (gamerscore is cosmetic);
 * the server's guarantees are: only catalog ids, no duplicates, and the
 * score is only ever recomputed server-side from the catalog.
 */
export const achievementsRouter = createTRPCRouter({
  /**
   * Idempotently merges locally-earned unlocks into the account and
   * recomputes gamerscore. Doubles as the post-login guest merge and the
   * ongoing signed-in write-through. `party-up` (sign in with GitHub) is
   * granted here server-side — reaching this procedure proves it.
   */
  merge: protectedProcedure
    .input(z.object({ ids: z.array(z.enum(ACHIEVEMENT_IDS)).max(ACHIEVEMENT_IDS.length) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.services.user.mergeAchievements(ctx.user.id, [...input.ids, 'party-up']);
    }),

  /**
   * The signed-in user's persisted unlocks with timestamps.
   */
  getMine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.services.user.getAchievements(ctx.user.id);
  }),
});
