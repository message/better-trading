type Browser = { runtime?: { getURL?: (value: string) => string } };
export const getExtensionUrl = (path: string) => {
  const maybeChrome = (globalThis as { chrome?: Browser }).chrome;
  if (maybeChrome?.runtime?.getURL) {
    return maybeChrome.runtime.getURL(path);
  }

  const maybeBrowser = (globalThis as { browser?: Browser }).browser;
  if (maybeBrowser?.runtime?.getURL) {
    return maybeBrowser.runtime.getURL(path);
  }

  return path;
};
