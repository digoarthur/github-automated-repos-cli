/**
 * @description Replaces template placeholders inside a string with user-provided values.
 * @param {string} content - The template text where replacements will occur.
 * @param {{ username: string, keyword: string }} params - Values to inject into placeholders.
 * @returns {string} The updated content with placeholders replaced.
 */
export default function injectHookPlaceholders(content, { username, keyword }) {
  return content
    .replaceAll("__GITHUB_USERNAME__", username)
    .replaceAll("__KEYWORD__", keyword);
}
