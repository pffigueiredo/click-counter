
import { db } from '../../db';
import { clicksTable } from '../../db/schema';
import { type CreateClickInput, type Click, clickSchema } from '../../schema';

/**
 * Records a user click in the database
 * @param input Optional information about the click (IP address, user agent)
 * @returns The newly created click record
 */
export async function createClick(input: CreateClickInput): Promise<Click> {
  const result = await db.insert(clicksTable)
    .values({
      ip_address: input.ip_address ?? null,
      user_agent: input.user_agent ?? null,
    })
    .returning()
    .execute();
  
  if (!result.length) {
    throw new Error('Failed to create click record');
  }
  
  // Parse through zod schema to ensure type safety
  return clickSchema.parse(result[0]);
}
