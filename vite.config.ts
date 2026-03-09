import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("data");

function encodeKey(key: string) { return key.replace(/:/g, "__"); }
function decodeKey(filename: string) { return filename.replace(/__/g, ":").replace(/\.json$/, ""); }

function storagePlugin() {
  return {
    name: "local-storage-api",
    configureServer(server: any) {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url?.startsWith("/storage")) return next();

        // LIST: GET /storage?prefix=tracker:
        if (req.method === "GET" && req.url.startsWith("/storage?")) {
          const prefix = new URL(req.url, "http://localhost").searchParams.get("prefix") || "";
          const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
          const keys = files.map(f => decodeKey(f)).filter(k => k.startsWith(prefix));
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ keys }));
          return;
        }

        // GET /storage/<encoded-key>
        if (req.method === "GET" && req.url.startsWith("/storage/")) {
          const key = decodeURIComponent(req.url.slice("/storage/".length));
          const file = path.join(DATA_DIR, encodeKey(key) + ".json");
          if (!fs.existsSync(file)) { res.statusCode = 404; res.end("null"); return; }
          const value = fs.readFileSync(file, "utf-8");
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ value }));
          return;
        }

        // PUT /storage/<encoded-key>
        if (req.method === "PUT" && req.url.startsWith("/storage/")) {
          const key = decodeURIComponent(req.url.slice("/storage/".length));
          const file = path.join(DATA_DIR, encodeKey(key) + ".json");
          let body = "";
          req.on("data", (chunk: string) => { body += chunk; });
          req.on("end", () => {
            fs.writeFileSync(file, body, "utf-8");
            res.statusCode = 200;
            res.end("ok");
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.VITE_ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || "";
  return {
    plugins: [react(), storagePlugin()],
    server: {
      host: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "https://api.anthropic.com/v1",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("x-api-key", apiKey);
              proxyReq.setHeader("anthropic-version", "2023-06-01");
              // Remove browser headers so Anthropic doesn't treat this as a direct browser request
              proxyReq.removeHeader("origin");
              proxyReq.removeHeader("referer");
            });
          },
        },
      },
    },
  };
});
