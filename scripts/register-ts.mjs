/** Registers the test-only TypeScript resolve hook (see ts-resolve.mjs). */
import { register } from "node:module";

register("./ts-resolve.mjs", import.meta.url);
