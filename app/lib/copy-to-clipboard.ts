export const copyToClipboard = async (value: string): Promise<void> => {
  try {
    // Check if Clipboard API is available
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported in this browser');
    }

    // Check if we're in a secure context
    if (!window.isSecureContext) {
      throw new Error('Clipboard API requires a secure context (HTTPS)');
    }

    // Use the modern Clipboard API
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
};
