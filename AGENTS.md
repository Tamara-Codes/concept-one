<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Running this project in Codex on Windows

- Do not start this project with plain `npm run dev`: `npm` is not on the normal PATH in the Codex runtime.
- Do not use the default Turbopack dev server in the restricted Codex environment. It fails while spawning the CSS worker with `Access is denied. (os error 5)`.
- First check whether `http://localhost:3100` already returns HTTP 200. Reuse a healthy existing server instead of starting a duplicate.
- If the existing server is unhealthy, stop only the exact PID reported by Next.js, then start the app from the repository root with the bundled Node runtime and Webpack:

```powershell
& 'C:\Users\tamar\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\next\dist\bin\next' dev --webpack -p 3100
```

- Keep that terminal session running. Verify the app before reporting success:

```powershell
$response = Invoke-WebRequest -Uri 'http://localhost:3100' -UseBasicParsing -TimeoutSec 15
$response.StatusCode
```

- The expected local preview URL is `http://localhost:3100` and the expected status is `200`.

## User preference for visual checks

- Do not open, refresh, screenshot, automate, or visually inspect the app's browser preview unless the user explicitly asks for a visual check or preview.
- For ordinary requested edits, make the scoped change and limit verification to non-visual technical checks when needed.
