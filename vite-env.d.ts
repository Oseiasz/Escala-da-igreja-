// Fix: Removed reference to "vite/client" which was causing a "Cannot find type definition file" error.
// Added type definition for `process.env.API_KEY` to align with Gemini API guidelines.
declare var process: {
  env: {
    readonly API_KEY: string;
  }
};
