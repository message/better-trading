import { ItemResultsType } from '@/types/item-results';
import { slugify } from '@/utils/slugify';
import type { ItemResultsParsedItem } from '@/types/item-results';

const priceCurrencySlug = (itemElement: HTMLDivElement): string | null => {
  const currencyNameElement = itemElement.querySelector<HTMLSpanElement>('[data-field="price"] .currency-text span');
  if (!currencyNameElement || !currencyNameElement.textContent) return null;

  return slugify(currencyNameElement.textContent);
};

const priceCurrencyValue = (itemElement: HTMLDivElement): number | null => {
  const currencyValueElement = itemElement.querySelector<HTMLSpanElement>('[data-field="price"] > br + span');
  if (!currencyValueElement || !currencyValueElement.textContent) return null;

  return parseFloat(currencyValueElement.textContent);
};

const socketsCount = (itemElement: HTMLDivElement): number =>
  itemElement.querySelectorAll('.sockets .socket').length || 0;

const itemType = (itemElement: HTMLDivElement): ItemResultsType => {
  const iconElement = itemElement.querySelector<HTMLImageElement>('.icon img');
  if (!iconElement) return ItemResultsType.UNKNOWN;

  const iconSrc = iconElement.src;

  if (/\/BodyArmours\//.test(iconSrc)) return ItemResultsType.ARMOR;
  if (/\/Helmets\//.test(iconSrc)) return ItemResultsType.HELMET;
  if (/\/Gloves\//.test(iconSrc)) return ItemResultsType.GLOVE;
  if (/\/Boots\//.test(iconSrc)) return ItemResultsType.BOOT;
  if (/\/Belts\//.test(iconSrc)) return ItemResultsType.BELT;
  if (/\/Amulets\//.test(iconSrc)) return ItemResultsType.AMULET;
  if (/\/Rings\//.test(iconSrc)) return ItemResultsType.RING;
  if (/\/Shields\//.test(iconSrc)) return ItemResultsType.SHIELD;
  if (/\/OneHandWeapons\//.test(iconSrc)) return ItemResultsType.ONE_HAND_WEAPON;
  if (/\/TwoHandWeapons\//.test(iconSrc)) return ItemResultsType.TWO_HAND_WEAPON;

  return ItemResultsType.UNKNOWN;
};

const itemLevel = (itemElement: HTMLDivElement): number | null => {
  const ilvlElement = itemElement.querySelector('.itemLevel');
  const ilvlMatch = ilvlElement?.textContent?.match(/(\d+)/);
  if (!ilvlMatch) return null;

  return parseInt(ilvlMatch[0], 10);
};

const sellerAccountName = (itemElement: HTMLDivElement): string | null => {
  const pmButtonElement = itemElement.querySelector<HTMLAnchorElement>('a.pm-btn');
  if (!pmButtonElement) return null;

  const match = pmButtonElement.href.match(/compose\?to=(.+)$/);
  if (!match) return null;

  const [, accountName] = match;

  return accountName;
};

const sellerCharacterName = (itemElement: HTMLDivElement): string | null => {
  const characterNameElement = itemElement.querySelector<HTMLSpanElement>('.character-name');
  if (!characterNameElement) return null;

  const match = (characterNameElement?.textContent || '').match(/IGN: (.+)/);
  if (!match) return null;

  const [, characterName] = match;

  return characterName;
};

/**
 * Parses a Path of Exile trade item result DOM element to extract structured data
 *
 * @param itemElement - The DOM element representing a single trade item result
 * @returns Parsed item data including price, sockets, type, ilvl, and seller info
 *
 * @example
 * const itemDiv = document.querySelector('.resultset .item');
 * const parsedItem = parseElement(itemDiv);
 * console.log(parsedItem.price.value, parsedItem.price.currencySlug);
 */
const parseElement = (itemElement: HTMLDivElement): ItemResultsParsedItem => ({
  price: {
    currencySlug: priceCurrencySlug(itemElement),
    value: priceCurrencyValue(itemElement),
  },
  socketsCount: socketsCount(itemElement),
  type: itemType(itemElement),
  ilvl: itemLevel(itemElement),
  seller: {
    accountName: sellerAccountName(itemElement),
    characterName: sellerCharacterName(itemElement),
  },
});

export { parseElement };
