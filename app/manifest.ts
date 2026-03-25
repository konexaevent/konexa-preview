import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Konexa",
    short_name: "Konexa",
    description: "Plataforma social per connectar persones a traves d'activitats reals en grups petits.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7ff",
    theme_color: "#6754ff",
    orientation: "portrait",
    lang: "ca",
    icons: [
      {
        src: "/logo.PNG",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/logo.PNG",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  };
}
