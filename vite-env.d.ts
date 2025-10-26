// Fix: The `declare var process` was overwriting the global Node.js `process` type,
// which caused a compile error in `vite.config.ts` and a "Cannot redeclare" error.
// This is corrected by augmenting the existing `NodeJS.ProcessEnv` interface. This
// safely adds the `API_KEY` type to `process.env` for client-side code without conflicts.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
