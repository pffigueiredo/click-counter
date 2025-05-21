
import { db } from '../../db';
import { clicksTable } from '../../db/schema';
import { count } from 'drizzle-orm';
import { type ClickCount } from '../../schema';

/**
 * Gets the total count of clicks from the database
 * @returns Object containing the total click count
 */
export async function getClickCount(): Promise<ClickCount> {
  try {
    const result = await db
      .select({ count: count() })
      .from(clicksTable)
      .execute();
    
    return { 
      count: result[0]?.count ?? 0 
    };
  } catch (error) {
    // Log the detailed error
    console.error('Failed to retrieve click count:', error);
    
    // Re-throw the error to preserve stack trace
    throw error;
  }
}
