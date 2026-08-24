import { PrismaClient, Prisma } from '@/generated/prisma/client';
import { GUEST_PROFILE, DEFAULT_AVATAR } from '../config/userConfig';
import { computeGamerscore, isAchievementId } from '../../constants/achievements';

type DbClient = PrismaClient | Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/**
 * UserService encapsulates all database logic for user profiles.
 */
export class UserService {
  private db: DbClient;

  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Finds a user by their ID. Returns guest profile if not found.
   */
  async findUserById(id?: string | null) {
    if (!id) {
      return GUEST_PROFILE;
    }

    const dbUser = await this.db.user.findUnique({
      where: { id },
      select: { id: true, name: true, gamerscore: true, avatar: true },
    });

    if (!dbUser) {
      return GUEST_PROFILE;
    }

    return {
      id: dbUser.id,
      name: dbUser.name ?? 'Player',
      gamerscore: dbUser.gamerscore,
      avatar: dbUser.avatar ?? DEFAULT_AVATAR,
      isGuest: false,
    };
  }

  /**
   * Updates a user's profile data.
   */
  async updateUserProfile(id: string, data: { name?: string; avatar?: string }) {
    try {
      return await this.db.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`User with ID '${id}' not found.`);
        }
        if (error.code === 'P2002') {
          throw new Error('The provided data conflicts with an existing user.');
        }
      }
      throw error;
    }
  }

  /**
   * Idempotently persists achievement unlocks and recomputes the user's
   * gamerscore from the catalog. Unknown ids are dropped; duplicates are
   * absorbed by the [userId, achievementId] unique constraint. The score is
   * only ever computed server-side from the catalog, so it is implicitly
   * capped at the catalog total.
   */
  async mergeAchievements(userId: string, ids: string[]) {
    const validIds = [...new Set(ids.filter(isAchievementId))];

    if (validIds.length > 0) {
      await this.db.userAchievement.createMany({
        data: validIds.map((achievementId) => ({ userId, achievementId })),
        skipDuplicates: true,
      });
    }

    const rows = await this.db.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
    });

    const gamerscore = computeGamerscore(rows.map((r) => r.achievementId));
    await this.db.user.update({
      where: { id: userId },
      data: { gamerscore },
    });

    return {
      unlockedIds: rows.map((r) => r.achievementId),
      gamerscore,
    };
  }

  /**
   * Returns the user's persisted unlocks with timestamps.
   */
  async getAchievements(userId: string) {
    return this.db.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
      orderBy: { unlockedAt: 'asc' },
    });
  }
}
