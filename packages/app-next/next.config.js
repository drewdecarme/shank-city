import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  config({ path: resolve(__dirname, "../../.env") });
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
