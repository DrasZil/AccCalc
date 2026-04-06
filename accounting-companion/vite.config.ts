import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function acccalcAssetManifestPlugin(): Plugin {
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
                .filter((assetPath) => assetPath !== "/asset-manifest.json")
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
    plugins: [react(), tailwindcss(), acccalcAssetManifestPlugin()],
});
