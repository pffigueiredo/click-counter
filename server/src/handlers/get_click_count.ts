
import { type ClickCount } from '../schema';

/**
 * Gets the total count of clicks from the database
 * @returns Object containing the total click count
 */
export declare function getClickCount(): Promise<ClickCount>;
