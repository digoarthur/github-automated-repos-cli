module.exports = {
  preset: "angular",
  writerOpts: {
    transform: (commit) => {
      if (!commit.hash) return null;

      // 🔑 Only user-relevant changes
      const allowedTypes = ["feat", "fix"];

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
        "next-template",
        "github-actions",
        "general",
      ];

     
      if (!allowedTypes.includes(commit.type)) {
        return null;
      }

      const shortHash = commit.hash.substring(0, 7);
      const hashLink =
        `https://github.com/DIGOARTHUR/github-automated-repos-cli/commit/${commit.hash}`;

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
          .replace(/next[-_]?template/i, "next-template")
          .replace(/github[-_]?actions?/i, "github-actions");
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
        "next-template",
        "general",
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
