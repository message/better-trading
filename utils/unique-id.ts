// Constants
const RADIX = 36;

const uniqueId = (): string => Math.random().toString(RADIX).substring(2) + Date.now().toString(RADIX);

export { uniqueId };
