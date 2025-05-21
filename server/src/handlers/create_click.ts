
import { type CreateClickInput, type Click } from '../schema';

/**
 * Records a user click in the database
 * @param input Optional information about the click (IP address, user agent)
 * @returns The newly created click record
 */
export declare function createClick(input: CreateClickInput): Promise<Click>;
