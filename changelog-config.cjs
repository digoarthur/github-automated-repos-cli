/**
 * --------------------------
 * CHANGELOG.md Generator (CLI)
 *---------------------------
 * Rules implemented:
 * - Includes commits of type `feat`, `fix`, `refactor`.
 * - Includes commits with known scopes.
 * - Normalizes scope names.
 * - Commits without scope go to `general`.
 * - Adds GitHub commit links with short hashes.
 * - Outputs Markdown tables.
 */

module.exports = {
  preset: "angular",
  writerOpts: {
    transform: (commit) => {
      if (!commit.hash) return null;

      const allowedTypes = ["feat", "fix", "refactor"];

      const knownScopes = [
        "cli",
        "init",
        "commands",
        "interactive",
        "utils",
        "projectFile",
        "pkgManager",
        "framework",
        "bin",
        "pageExample",
        "page",
        "vite-template",
        "docs",
        "changelog",
        "script",
        "general",
      ];

      const shouldInclude =
        allowedTypes.includes(commit.type) ||
        (commit.scope && knownScopes.includes(commit.scope));

      if (!shouldInclude) return null;

      const shortHash = commit.hash.substring(0, 7);
      const hashLink = `https://github.com/DIGOARTHUR/github-automated-repos-cli/commit/${commit.hash}`;

      let normalizedScope = commit.scope;

      if (normalizedScope) {
        normalizedScope = normalizedScope
          .replace(/files?/i, "projectFile")
          .replace(/project[-_]?file/i, "projectFile")
          .replace(/pkg[-_]?manager/i, "pkgManager")
          .replace(/framework/i, "framework")
          .replace(/interactive/i, "interactive")
          .replace(/commands?/i, "commands")
          .replace(/utils?/i, "utils")
          .replace(/bin/i, "bin")
          .replace(/init/i, "init")
          .replace(/cli/i, "cli")
          .replace(/page[-_]?example/i, "pageExample")
          .replace(/vite[-_]?template/i, "vite-template")
          .replace(/docs?/i, "docs")
          .replace(/changelog/i, "changelog");
      }

      if (!normalizedScope || !knownScopes.includes(normalizedScope)) {
        normalizedScope = "general";
      }

      return {
        ...commit,
        scope: normalizedScope,
        shortHash,
        hashLink,
      };
    },

    groupBy: "scope",

    commitGroupsSort: (a, b) => {
      const order = [
        "cli",
        "init",
        "commands",
        "interactive",
        "projectFile",
        "utils",
        "pkgManager",
        "framework",
        "pageExample",
        "page",
        "vite-template",
        "docs",
        "general",
        "changelog",
        "script",
        "bin",
      ];
      return order.indexOf(a.title) - order.indexOf(b.title);
    },

    commitsSort: ["type", "subject"],

    headerPartial:
      '<a name="{{version}}"></a>\n# {{version}} ({{date}})\n\n',

    commitPartial:
      "| [{{shortHash}}]({{hashLink}}) | {{type}} | {{subject}} |\n",

    mainTemplate: `{{> header}}
{{#each commitGroups}}
### {{title}}
| Commit | Type | Description |
|--------|------|-------------|
{{#each commits}}{{> commit}}{{/each}}

{{/each}}`,
  },
};
