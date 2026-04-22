import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, "package.json"), "utf8").replace(/^\uFEFF/, "")
);

function acccalcAssetManifestPlugin() {
    return {
        name: "acccalc-asset-manifest",
        generateBundle(_, bundle) {
            const assets = Object.values(bundle)
                .flatMap((output) => {
                    if (output.type === "chunk") {
                        return [`/${output.fileName}`];
                    }

                    if (
                        /\.(css|js|png|svg|woff2?|ttf|webmanifest)$/i.test(output.fileName)
                    ) {
                        return [`/${output.fileName}`];
                    }

                    return [];
                })
                .filter(
                    (assetPath) =>
                        assetPath !== "/asset-manifest.json" &&
                        assetPath !== "/service-worker.js"
                )
                .toSorted();

            this.emitFile({
                type: "asset",
                fileName: "asset-manifest.json",
                source: JSON.stringify(
                    {
                        assets: Array.from(new Set(assets)),
                    },
                    null,
                    2
                ),
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    define: {
        PACKAGE_VERSION: JSON.stringify(packageJson.version),
    },
    plugins: [react(), tailwindcss(), acccalcAssetManifestPlugin()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                serviceWorker: resolve(__dirname, "src/service-worker.ts"),
            },
            output: {
                entryFileNames: (chunkInfo) =>
                    chunkInfo.name === "serviceWorker"
                        ? "service-worker.js"
                        : "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
    },
});
