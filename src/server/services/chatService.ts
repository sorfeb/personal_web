import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '@/generated/prisma/client';
import { CHAT_LIMITS } from '../../constants/chat';

/**
 * Strip C0/C1 control characters, keeping the newline, carriage return and tab
 * that the caller normalises immediately afterwards.
 *
 * Written as a code-point test rather than a regex character class on purpose:
 * the equivalent class needs literal control bytes in the source, which are
 * invisible in an editor and easy for tooling to mangle.
 */
function stripControlChars(input: string): string {
  let out = '';

  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = code < 0x20 || code === 0x7f;
    // 0x0A newline, 0x0D carriage return, 0x09 tab.
    const isAllowedWhitespace = code === 0x0a || code === 0x0d || code === 0x09;

    if (!isControl || isAllowedWhitespace) {
      out += char;
    }
  }

  return out;
}

/**
 * Normalise a submitted message body.
 *
 * The client trims before sending, which is a courtesy, not a guarantee — a
 * direct tRPC call bypasses it entirely. Everything here therefore runs on the
 * server, and the length check happens *after* normalising, so 500 spaces plus
 * one character is a one-character message rather than an over-length one.
 *
 * Deliberately not an HTML sanitiser: React escapes text nodes on render, so
 * stripping markup here would corrupt legitimate messages (`<3`, code snippets)
 * to defend against an attack the renderer already prevents.
 */
export function sanitizeMessageText(input: string): string {
  return (
    stripControlChars(input)
      .replace(/\r\n?/g, '\n')
      .replace(/\t/g, ' ')
      // Runs of spaces collapse; a deliberate blank line survives, three do not.
      .replace(/[^\S\n]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      // Trailing spaces on each line, then the body as a whole.
      .replace(/[^\S\n]+$/gm, '')
      .trim()
  );
}

/**
 * Reject a message that breaches any burst tier.
 *
 * One indexed query covers all three limits: fetch the author's timestamps
 * inside the longest window and count subsets in memory. Checking each tier
 * separately would be three round trips answering the same question.
 *
 * This is derived state — no counter to drift, nothing to provision, and it
 * stays correct across serverless instances because the database is the only
 * thing keeping score.
 */
export async function assertWithinRateLimit(
  db: PrismaClient,
  authorId: string,
  now: Date = new Date()
): Promise<void> {
  const windowStart = new Date(now.getTime() - CHAT_LIMITS.LONG_WINDOW_MS);

  const recent = await db.message.findMany({
    where: { authorId, createdAt: { gte: windowStart } },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
    // One past the long-burst ceiling is all that can change the verdict.
    take: CHAT_LIMITS.LONG_BURST_MAX + 1,
  });

  if (recent.length === 0) return;

  const sinceNewest = now.getTime() - recent[0].createdAt.getTime();
  if (sinceNewest < CHAT_LIMITS.MIN_INTERVAL_MS) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'You are sending messages too quickly. Wait a moment.',
    });
  }

  const shortCutoff = now.getTime() - CHAT_LIMITS.SHORT_WINDOW_MS;
  const inShortWindow = recent.filter(
    (m) => m.createdAt.getTime() >= shortCutoff
  ).length;

  if (inShortWindow >= CHAT_LIMITS.SHORT_BURST_MAX) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many messages at once. Give it a few seconds.',
    });
  }

  if (recent.length >= CHAT_LIMITS.LONG_BURST_MAX) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'You have hit the per-minute message limit.',
    });
  }
}
