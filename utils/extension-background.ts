// Type guard to safely access chrome/browser APIs
declare const chrome: typeof browser;

/**
 * Fetches a resource from poe.ninja API via the background script
 *
 * This function sends a message to the background script which handles
 * the actual fetch request to avoid CORS issues.
 *
 * @param resource - The API resource path (e.g., '/poe1/api/data/index-state')
 * @returns Promise resolving to the API response data
 * @throws Error if the request fails or returns null
 */
const fetchPoeNinjaResource = async (resource: string): Promise<unknown> =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ query: 'poe-ninja', resource }, (payload: unknown) => {
      if (payload) {
        resolve(payload);
      } else {
        reject(new Error(`Failed to fetch poe.ninja resource: ${resource}`));
      }
    });
  });

/** Converts a Path of Building Build Code to an Export String in the background script; null when it is not a build */
const convertPobBuildCode = async (buildCode: string): Promise<string | null> =>
  new Promise(resolve => {
    chrome.runtime.sendMessage({ query: 'pob-import', buildCode }, (exportString: string | null) =>
      resolve(exportString ?? null),
    );
  });

export { convertPobBuildCode, fetchPoeNinjaResource };
