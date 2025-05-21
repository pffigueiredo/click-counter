
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { clicksTable } from '../db/schema';
import { type CreateClickInput } from '../schema';
import { createClick } from '../handlers/impl/create_click';
import { eq } from 'drizzle-orm';

describe('createClick', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a click with all provided information', async () => {
    const testInput: CreateClickInput = {
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    };

    const result = await createClick(testInput);

    // Validate basic fields
    expect(result.id).toBeDefined();
    // Use type assertion to handle the optional nature of these fields
    expect(result.ip_address).toEqual(testInput.ip_address || null);
    expect(result.user_agent).toEqual(testInput.user_agent || null);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a click with null values when not provided', async () => {
    const testInput: CreateClickInput = {};

    const result = await createClick(testInput);

    expect(result.id).toBeDefined();
    expect(result.ip_address).toBeNull();
    expect(result.user_agent).toBeNull();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save click to database', async () => {
    const testInput: CreateClickInput = {
      ip_address: '10.0.0.1',
      user_agent: 'Test User Agent'
    };

    const result = await createClick(testInput);

    // Query using proper drizzle syntax
    const clicks = await db.select()
      .from(clicksTable)
      .where(eq(clicksTable.id, result.id))
      .execute();

    expect(clicks).toHaveLength(1);
    // Use null coalescing to handle undefined values
    expect(clicks[0].ip_address).toEqual(testInput.ip_address ?? null);
    expect(clicks[0].user_agent).toEqual(testInput.user_agent ?? null);
    expect(clicks[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle partial input data correctly', async () => {
    // Only provide IP address
    const ipOnlyInput: CreateClickInput = {
      ip_address: '172.16.254.1'
    };
    
    const ipOnlyResult = await createClick(ipOnlyInput);
    expect(ipOnlyResult.ip_address).toEqual(ipOnlyInput.ip_address ?? null);
    expect(ipOnlyResult.user_agent).toBeNull();
    
    // Only provide user agent
    const uaOnlyInput: CreateClickInput = {
      user_agent: 'Test Browser/1.0'
    };
    
    const uaOnlyResult = await createClick(uaOnlyInput);
    expect(uaOnlyResult.ip_address).toBeNull();
    expect(uaOnlyResult.user_agent).toEqual(uaOnlyInput.user_agent ?? null);
  });
});
