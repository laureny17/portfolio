"use client";

import ArtGallery from "@/components/art-gallery";
import { artSections } from "@/data/art";

export default function Art() {
  return (
    <main className="col-wide">
      <div className="relative px-0">
        {/* Gallery */}
        <ArtGallery sections={artSections} />
      </div>
    </main>
  );
}
