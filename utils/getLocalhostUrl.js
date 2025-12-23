/**
 * @description Returns the correct localhost URL based on the detected framework.
 * @param {"next-app" | "next-pages" | "vite" | "react" | string} framework - The detected framework type.
 * @param {string} route - The route to append to the localhost URL.
 * @returns {string} The complete localhost URL for the given framework.
 */
export default function getLocalhostUrl(framework, route = "/projects") {
  let port = 3000; // default

  switch (framework) {
    case "vite":
      port = 5173;
      break;

    case "next-app":
    case "next-pages":
    case "react":
    default:
      port = 3000;
      break;
  }

  return `http://localhost:${port}${route}`;
}
