interface RegroupSimilarsOptions {
  toggleButtonText?: (count: number) => string;
}

/**
 * Service class for regrouping similar items in trade results
 *
 * Groups items with the same seller, name, and price together.
 * Provides toggle buttons to show/hide grouped items.
 */
class RegroupSimilarsEnhancer {
  slug = 'regroup-similars';

  private options: RegroupSimilarsOptions;

  constructor(options: RegroupSimilarsOptions = {}) {
    this.options = options;
  }

  enhance(itemElement: HTMLDivElement): void {
    const currentHash = this.setItemHash(itemElement);

    const originalResult = this.findOriginalResult(itemElement, currentHash);

    if (originalResult.dataset.id === itemElement.dataset.id) return;

    const buttonState = this.updateToggleButtonFor(originalResult);
    itemElement.setAttribute('bt-regroup-state', buttonState);
  }

  private findOriginalResult(result: HTMLElement, currentHash: string): HTMLElement {
    const previousResult = result.previousElementSibling as HTMLElement;
    if (!previousResult) return result;

    const previousHash = previousResult.getAttribute('bt-regroup-hash');

    if (previousHash !== currentHash) return result;
    return this.findOriginalResult(previousResult, currentHash);
  }

  private setItemHash(result: HTMLElement): string {
    const seller = result
      .querySelector('.profile-link [href]')
      ?.getAttribute('href')
      ?.replace(/^\/account\/view-profile\//, '');
    const itemName = result.querySelector('.itemHeader')?.textContent?.replace(/superior/i, '');
    const price = result.querySelector('.price')?.textContent;

    const hash = btoa(
      encodeURIComponent([seller, itemName, price].filter(Boolean).join('').replace(/\s/g, '').toLowerCase()),
    );
    result.setAttribute('bt-regroup-hash', hash);

    return hash;
  }

  private injectToggleButton(result: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');

    button.classList.add('btn', 'btn-default', 'bt-group-button');

    button.dataset.state = 'hidden';

    button.addEventListener('click', this.handleToggleClick);

    const wrapper = window.document.createElement('span');
    wrapper.appendChild(button);

    const detailsElement = result.querySelector('.details .btns');
    detailsElement?.appendChild(button);

    return button;
  }

  private updateToggleButtonFor(result: HTMLElement): string {
    let buttonElement: HTMLButtonElement = result.querySelector('.bt-group-button') as HTMLButtonElement;

    if (!buttonElement) {
      buttonElement = this.injectToggleButton(result);
    }

    const currentCount = buttonElement.dataset.count;
    const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1;
    buttonElement.dataset.count = newCount.toString();

    if (this.options.toggleButtonText) {
      buttonElement.innerText = this.options.toggleButtonText(newCount);
    } else {
      buttonElement.innerText = `+${newCount} similar`;
    }

    return buttonElement.dataset.state as string;
  }

  private handleToggleClick = (event: MouseEvent): void => {
    const buttonElement = event.target as HTMLButtonElement;
    const resultElement = buttonElement.closest('[bt-enhanced]') as HTMLElement;

    const newState = buttonElement.dataset.state === 'hidden' ? 'visible' : 'hidden';
    buttonElement.dataset.state = newState;

    this.toggleSimilarResult(resultElement, newState, resultElement.getAttribute('bt-regroup-hash') as string);
  };

  private toggleSimilarResult(result: HTMLElement, state: string, hash: string): void {
    const nextResult = result.nextElementSibling as HTMLElement | undefined;
    if (!nextResult || nextResult.getAttribute('bt-regroup-hash') !== hash) return;

    nextResult.setAttribute('bt-regroup-state', state);
    this.toggleSimilarResult(nextResult, state, hash);
  }
}

const regroupSimilarsEnhancer = new RegroupSimilarsEnhancer();

export { regroupSimilarsEnhancer, RegroupSimilarsEnhancer };
export type { RegroupSimilarsOptions };
