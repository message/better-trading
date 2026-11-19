import { matchMod } from './mods';
import './test-utils';
import { describe, expect, it } from 'vitest';
import type { ModMatch } from './mods';

describe('matchMod', () => {
  it('matches an Allocates line of Forbidden Flame or Flesh to the stats of both jewels, so either side of the pair is found', () => {
    // A jewel's line names its counterpart; the node is the option of both stats
    const [flame, flesh] = ['Flame', 'Flesh'].map(
      name => matchMod(`Allocates Headsman if you have the matching modifier on Forbidden ${name}`)!,
    ) as [ModMatch, ModMatch];
    // The same order for both jewels, so their searches are equal
    expect(flame.ids).toEqual(['explicit.stat_1190333629|3184', 'explicit.stat_2460506030|3184']);
    expect(flesh.ids).toEqual(flame.ids);
  });

  it('matches a flat mod to every modifier type of its stat', () => {
    expect(matchMod('+142 to maximum Life')).toEqual({
      ids: [
        'explicit.stat_3299347043',
        'implicit.stat_3299347043',
        'fractured.stat_3299347043',
        'crafted.stat_3299347043',
      ],
      value: 142,
    });
  });

  it('averages a damage range', () => {
    expect(matchMod('Adds 10 to 21 Fire Damage to Attacks')?.value).toBe(15.5);
  });

  it('keeps decimal values', () => {
    expect(matchMod('Regenerate 10.6 Life per second')?.value).toBe(10.6);
  });

  it('keeps numbers that are part of the stat text', () => {
    expect(matchMod('Socketed Gems are Supported by Level 20 Burning Damage Support')).toBeDefined();
  });

  it('matches a negative roll without a value to scale', () => {
    const match = matchMod('-58 to maximum Mana');
    expect(match?.ids).toContain('explicit.stat_1050105434');
    expect(match?.value).toBeUndefined();
  });

  it('leaves out pseudo stats', () => {
    for (const id of matchMod('+46% to Fire Resistance')!.ids) expect(id).not.toMatch(/^pseudo\./);
  });

  it('returns undefined for an unknown line', () => {
    expect(matchMod('Grants the ability to fly')).toBeUndefined();
  });
});
