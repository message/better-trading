/** Fallback for content scripts where the async Clipboard API is missing or rejects (the way 1.9.1 copied) */
const copyWithExecCommand = (value: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const hasCopied = document.execCommand('copy');
  textarea.remove();

  if (!hasCopied) throw new Error('Failed to copy to clipboard');
};

export const copyToClipboard = async (value: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    copyWithExecCommand(value);
  }
};
