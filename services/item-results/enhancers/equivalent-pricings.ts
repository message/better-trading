import { fetchChaosRatios } from '@/services/poe-ninja';
import { parseCurrentPath } from '@/utils/trade-location';
import type { PoeNinjaCurrenciesRatios } from '@/services/poe-ninja';
import type { ItemResultsParsedItem } from '@/types/item-results';

const CHAOS_IMAGE_URL = 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png';
const CHAOS_ALT = 'chaos';
const CHAOS_SLUG = 'chaos-orb';
const NORMALIZED_CURRENCY_IMAGE_URL = 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png';
const NORMALIZED_CURRENCY_ALT = 'divine';
const NORMALIZED_CURRENCY_SLUG = 'divine-orb';
const NORMALIZED_CURRENCY_EQUIVALENCE_THRESHOLD = 0.5;
const EQUAL_HTML = '<span class="bt-equivalent-pricings-equals">=</span>';

/**
 * Service class for displaying equivalent currency pricings from poe.ninja
 *
 * Shows chaos equivalents for non-chaos prices and divine equivalents for chaos prices.
 * Uses poe.ninja currency ratios API data.
 */
class EquivalentPricingsEnhancer {
  slug = 'equivalent-pricings';

  private chaosRatios: PoeNinjaCurrenciesRatios | null = null;

  /**
   * Loads the ratios for the current league. PoE 2 and console realm leagues (`sony/Standard`) are not on poe.ninja,
   * and a poe.ninja failure only skips pricings.
   */
  async prepare(): Promise<void> {
    const { league, version } = parseCurrentPath(window.location.pathname);
    this.chaosRatios = null;
    if (version !== '1' || !league || league.includes('/')) return;

    try {
      this.chaosRatios = await fetchChaosRatios(league);
    } catch (error) {
      console.warn('[equivalent-pricings] poe.ninja ratios unavailable', error);
    }
  }

  enhance(itemElement: HTMLDivElement, { price }: ItemResultsParsedItem): void {
    if (!this.chaosRatios) return;

    const pricingContainerElement = itemElement.querySelector<HTMLDivElement>('.price');
    const currencyImageElement = itemElement.querySelector<HTMLImageElement>(
      '[data-field="price"] .currency-image img',
    );

    if (!pricingContainerElement || !currencyImageElement || !price.currencySlug || !price.value) return;

    const currencySlug = price.currencySlug;
    const currencyValue = price.value;
    const chaosValue = this.chaosRatios[currencySlug];
    const normalizedCurrencyValue = this.chaosRatios[NORMALIZED_CURRENCY_SLUG];

    if (chaosValue && currencyValue) {
      this.handleNonChaosPricedItem(pricingContainerElement, currencyImageElement, currencyValue, chaosValue);
    } else if (currencySlug === CHAOS_SLUG && normalizedCurrencyValue) {
      this.handleChaosPricedItem(pricingContainerElement, currencyValue, normalizedCurrencyValue);
    }
  }

  private handleNonChaosPricedItem(
    pricingContainerElement: HTMLElement,
    currencyImageElement: HTMLImageElement,
    currencyValue: number,
    chaosValue: number,
  ): void {
    const chaosEquivalentValue = Math.round(currencyValue * chaosValue);
    if (!chaosEquivalentValue) return;

    pricingContainerElement.append(this.renderChaosEquivalence(chaosEquivalentValue));

    const flooredCurrencyValue = Math.floor(currencyValue);
    if (flooredCurrencyValue === 0 || chaosValue < 1 || flooredCurrencyValue === currencyValue) return;

    const chaosFractionValue = Math.round((currencyValue - flooredCurrencyValue) * chaosValue);
    pricingContainerElement.append(
      this.renderChaosFraction(
        flooredCurrencyValue,
        currencyImageElement.src,
        currencyImageElement.alt,
        chaosFractionValue,
      ),
    );
  }

  private handleChaosPricedItem(
    pricingContainerElement: HTMLElement,
    currencyValue: number,
    normalizedCurrencyValue: number,
  ): void {
    if (currencyValue < NORMALIZED_CURRENCY_EQUIVALENCE_THRESHOLD * normalizedCurrencyValue) return;

    const roundNormalizedCurrencyValue = Math.round((currencyValue / normalizedCurrencyValue) * 10) / 10;
    pricingContainerElement.append(this.renderNormalizedCurrencyEquivalence(roundNormalizedCurrencyValue));
  }

  private renderChaosEquivalence(chaosEquivalentValue: number): HTMLElement {
    const element = window.document.createElement('span');
    element.classList.add('bt-equivalent-pricings', 'bt-equivalent-pricings-equivalent');

    element.innerHTML = `<span>${EQUAL_HTML}${chaosEquivalentValue}×<img src="${CHAOS_IMAGE_URL}" alt="${CHAOS_ALT}" /></span>`;

    return element;
  }

  private renderChaosFraction(
    flooredCurrencyValue: number,
    currencyIconUrl: string,
    currencyIconAlt: string,
    chaosFractionValue: number,
  ): HTMLElement {
    const element = window.document.createElement('span');
    element.classList.add('bt-equivalent-pricings', 'bt-equivalent-pricings-chaos-fraction');

    const flooredPart = `${flooredCurrencyValue}×<img src="${currencyIconUrl}" alt="${currencyIconAlt}" />`;
    const fractionPart = `+${chaosFractionValue}×<img src="${CHAOS_IMAGE_URL}" alt="${CHAOS_ALT}" />`;
    element.innerHTML = `<span>${EQUAL_HTML}${flooredPart}${fractionPart}</span>`;

    return element;
  }

  private renderNormalizedCurrencyEquivalence(normalizedCurrencyValue: number): HTMLElement {
    const element = window.document.createElement('span');
    element.classList.add('bt-equivalent-pricings', 'bt-equivalent-pricings-equivalent');

    element.innerHTML = `<span>${EQUAL_HTML}${normalizedCurrencyValue}×<img src="${NORMALIZED_CURRENCY_IMAGE_URL}" alt="${NORMALIZED_CURRENCY_ALT}" /></span>`;

    return element;
  }
}

const equivalentPricingsEnhancer = new EquivalentPricingsEnhancer();

export { equivalentPricingsEnhancer, EquivalentPricingsEnhancer };
