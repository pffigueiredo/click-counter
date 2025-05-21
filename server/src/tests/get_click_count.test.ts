
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { clicksTable } from '../db/schema';
import { getClickCount } from '../handlers/impl/get_click_count';

describe('getClickCount', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return zero when no clicks exist', async () => {
    const result = await getClickCount();
    expect(result.count).toEqual(0);
  });

  it('should return the correct count when clicks exist', async () => {
    // Insert some test clicks
    await db.insert(clicksTable)
      .values([
        { ip_address: '192.168.1.1', user_agent: 'Mozilla/5.0' },
        { ip_address: '192.168.1.2', user_agent: 'Chrome/90.0' },
        { ip_address: '192.168.1.3', user_agent: 'Safari/14.0' }
      ])
      .execute();

    const result = await getClickCount();
    expect(result.count).toEqual(3);
  });

  it('should handle a large number of clicks', async () => {
    // Create a large batch of clicks
    const clickBatch = Array.from({ length: 50 }, (_, i) => ({
      ip_address: `192.168.0.${i % 255}`,
      user_agent: `TestAgent/${i}`
    }));

    await db.insert(clicksTable)
      .values(clickBatch)
      .execute();

    const result = await getClickCount();
    expect(result.count).toEqual(50);
  });

  it('should include clicks with null fields in the count', async () => {
    // Insert clicks with null fields
    await db.insert(clicksTable)
      .values([
        { ip_address: null, user_agent: 'Mozilla/5.0' },
        { ip_address: '192.168.1.2', user_agent: null },
        { ip_address: null, user_agent: null }
      ])
      .execute();

    const result = await getClickCount();
    expect(result.count).toEqual(3);
  });
});
