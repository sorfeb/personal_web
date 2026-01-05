import { PrismaClient, Prisma } from '@prisma/client';
import { GUEST_PROFILE, DEFAULT_AVATAR } from '../config/userConfig';
import { UserNotFoundError, DuplicateUserError } from '../errors/serviceErrors';

type DbClient = PrismaClient | Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/**
 * UserService encapsulates all database logic for user profiles.
 * It's designed to be instantiated once per request and injected into the tRPC context.
 */
export class UserService {
  private db: DbClient;

  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Finds a user by their StackAuth ID. If no ID is provided or the user is not found,
   * it returns a default guest profile. This centralizes all guest logic.
   * @param stackAuthId - The user's StackAuth ID (optional).
   * @returns The user's profile or a guest profile.
   */
  async findUserByStackAuthId(stackAuthId?: string | null) {
    if (!stackAuthId) {
      return GUEST_PROFILE;
    }

    const dbUser = await this.db.user.findUnique({
      where: { stackAuthId },
      select: { id: true, name: true, gamerscore: true, avatar: true },
    });

    if (!dbUser) {
      console.warn(`Authenticated user with stackAuthId '${stackAuthId}' not found in DB. Returning guest.`);
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
   * @param stackAuthId - The user's StackAuth ID.
   * @param data - The data to update (name and/or avatar).
   * @returns The updated user object.
   * @throws {UserNotFoundError} If the user to update is not found.
   * @throws {DuplicateUserError} If the update violates a unique constraint.
   */
  async updateUserProfile(stackAuthId: string, data: { name?: string; avatar?: string }) {
    try {
      return await this.db.user.update({
        where: { stackAuthId },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new UserNotFoundError(`User with StackAuth ID '${stackAuthId}' not found.`);
        }
        if (error.code === 'P2002') {
          throw new DuplicateUserError('The provided name or other unique data conflicts with an existing user.');
        }
      }
      // Re-throw any other unexpected errors
      throw error;
    }
  }
}
