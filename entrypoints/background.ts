interface PoeNinjaMessage {
  query: 'poe-ninja';
  resource: string;
}

type MessageRequest = PoeNinjaMessage;

const handlePoeNinjaRequest = async (resource: string): Promise<unknown> => {
  try {
    const response = await fetch(`https://poe.ninja/api${resource}`);

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
