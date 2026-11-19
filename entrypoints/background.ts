import { toExportString } from '@/services/pob';
import { loadStats } from '@/services/pob/mods';

interface PoeNinjaMessage {
  query: 'poe-ninja';
  resource: string;
}

interface PobImportMessage {
  query: 'pob-import';
  buildCode: string;
}

type MessageRequest = PoeNinjaMessage | PobImportMessage;

const POE_NINJA_ORIGIN = 'https://poe.ninja';

const handlePoeNinjaRequest = async (resource: string): Promise<unknown> => {
  try {
    // Only poe.ninja: the manifest grants nothing else, and a crafted resource must not reach another host
    const url = new URL(resource, POE_NINJA_ORIGIN);
    if (url.origin !== POE_NINJA_ORIGIN) throw new Error(`Not a poe.ninja resource: ${resource}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[poe-ninja] Failed to fetch resource: ${resource}`, response.status);
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[poe-ninja] Fetch error:', error);
    throw error;
  }
};

// Loaded on the first import only; a failed load is retried on the next one
let pobStats: Promise<void> | undefined;

/** Path of Building Build Code to an Export String; null when the code is not a build */
const handlePobImport = async (buildCode: string): Promise<string | null> => {
  pobStats ??= fetch(browser.runtime.getURL('/pob-stats.ndjson'))
    .then(response => response.text())
    .then(loadStats)
    .catch(error => {
      pobStats = undefined;
      throw error;
    });

  try {
    await pobStats;
    return (await toExportString(buildCode)).exportString;
  } catch (error) {
    console.error('[pob-import] Conversion error:', error);
    return null;
  }
};

export default defineBackground(() => {
  console.log('Better Trading background service started', { id: browser.runtime.id });

  // Handle messages from content scripts
  browser.runtime.onMessage.addListener((request: MessageRequest, _sender, sendResponse) => {
    if (request.query === 'poe-ninja') {
      handlePoeNinjaRequest(request.resource)
        .then(sendResponse)
        .catch(() => sendResponse(null));

      // Return true to indicate we will send a response asynchronously
      return true;
    }

    if (request.query === 'pob-import') {
      handlePobImport(request.buildCode).then(sendResponse);
      return true;
    }

    return false;
  });
});
