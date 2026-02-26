import { PrismaClient, Prisma } from '@prisma/client';
import { GUEST_PROFILE, DEFAULT_AVATAR } from '../config/userConfig';

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
}
