// utils/placeholders.js
export default function injectPlaceholders(content, { username, keyword }) {
  return content
    .replaceAll("__GITHUB_USERNAME__", username)
    .replaceAll("__KEYWORD__", keyword);
}
