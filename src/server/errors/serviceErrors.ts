/**
 * Custom error classes for the service layer.
 * These errors abstract away data-layer-specific exceptions (e.g., Prisma errors)
 * and provide a clear, domain-specific error API for the tRPC routers.
 */

/**
 * Thrown when a requested user is not found in the database.
 */
export class UserNotFoundError extends Error {
  constructor(message = 'The requested user was not found.') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Thrown when attempting to create or update a user violates a unique constraint (e.g., duplicate email or name).
 */
export class DuplicateUserError extends Error {
  constructor(message = 'A user with the provided details already exists.') {
    super(message);
    this.name = 'DuplicateUserError';
  }
}
