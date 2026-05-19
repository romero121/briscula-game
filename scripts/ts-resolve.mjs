/**
 * Minimal ESM resolve hook so Node's built-in test runner can load the
 * TypeScript sources, which use Next.js-idiomatic extensionless relative
 * imports (`./deck`, `../types`). Test-only; zero dependencies; never
 * part of the Next.js build.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CANDIDATES = [".ts", ".tsx", "/index.ts"];

export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExt = /\.(m|c)?(t|j)sx?$/.test(specifier);
  if (isRelative && !hasExt && context.parentURL) {
    for (const ext of CANDIDATES) {
      const url = new URL(specifier + ext, context.parentURL);
      if (existsSync(fileURLToPath(url))) {
        return nextResolve(specifier + ext, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
