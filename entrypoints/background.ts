interface PoeNinjaMessage {
  query: 'poe-ninja';
  resource: string;
}

type MessageRequest = PoeNinjaMessage;

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

    return false;
  });
});
