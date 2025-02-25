/**
 * Replaces symbols in a string with spaces.
 * @param {string} str - The input string.
 * @returns {string} - The normalized string.
 */
export const replaceSymbolsWithSpace = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  };