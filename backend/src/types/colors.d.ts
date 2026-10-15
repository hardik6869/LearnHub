// colors@1 ships index.d.ts at the package root, but "main" points to lib/index.js,
// so TypeScript can't find the declarations on its own. Re-export them (types only).
declare module "colors" {
  export * from "colors/index";
}
