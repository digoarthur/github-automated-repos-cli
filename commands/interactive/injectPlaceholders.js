
export default function injectPlaceholders(content, replacements = {}) {
  const username = replacements.username ?? "";
  const keyword = replacements.keyword ?? "";

  return content
    .split("__GITHUB_USERNAME__").join(username)
    .split("__KEYWORD__").join(keyword);
}
