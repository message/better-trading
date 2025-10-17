/**
 * Utility functions for scraping data from Path of Exile trade search panel DOM
 * These functions extract item information from the trade site's search interface
 */

// Constants
const NULL_RARITY = 'Any';
const NULL_CATEGORY = 'Any';

// Selectors
const SEARCH_INPUT_SELECTOR = '.search-panel .search-bar .search-left input';
const CATEGORY_INPUT_SELECTOR =
  '.search-advanced-items .filter-group:nth-of-type(1) .filter-property:nth-of-type(1) input';
const RARITY_INPUT_SELECTOR =
  '.search-advanced-items .filter-group:nth-of-type(1) .filter-property:nth-of-type(2) input';
const STATS_SELECTOR = '.search-advanced-pane:last-child .filter-group-body .filter:not(.disabled) .filter-title';

/**
 * Scrapes an input value from the DOM
 */
const scrapeInputValue = (selector: string, nullValue?: string): string | null => {
  const input: HTMLInputElement | null = document.querySelector(selector);
  if (!input) return null;

  const value = input.value;
  if (!value) return null;
  if (nullValue && nullValue === value) return null;

  return value;
};

/**
 * Gets the item name from the search panel
 */
const getName = (): string | null => scrapeInputValue(SEARCH_INPUT_SELECTOR);

/**
 * Gets the item category from the search panel
 */
const getCategory = (): string | null => scrapeInputValue(CATEGORY_INPUT_SELECTOR, NULL_CATEGORY);

/**
 * Gets the item rarity from the search panel
 */
const getRarity = (): string | null => scrapeInputValue(RARITY_INPUT_SELECTOR, NULL_RARITY);

/**
 * Gets the list of stat filters from the search panel
 * Returns normalized stat names (lowercase, trimmed, without "pseudo" prefix)
 */
const getStats = (): string[] => {
  const stats: string[] = [];

  document.querySelectorAll(STATS_SELECTOR).forEach((item: Element) => {
    let stat = (item as HTMLElement).innerText;
    stat = stat.trim();
    stat = stat.toLowerCase();
    stat = stat.replace(/^pseudo /, '');

    stats.push(stat);
  });

  return stats;
};

/**
 * Recommends a title for the current search based on available information
 * Priority: name > category + rarity > category > empty string
 */
const recommendTitle = (): string => {
  const name = getName();
  if (name) return name;

  const category = getCategory();
  const rarity = getRarity();

  if (!category) return '';
  if (!rarity) return category;

  return `${category} (${rarity})`;
};

export { getName, getCategory, getRarity, getStats, recommendTitle };
