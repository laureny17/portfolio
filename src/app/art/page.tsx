import ArtIndex from "@/components/art-index";
import { artSections } from "@/data/art";

export default function Art() {
  return (
    <main className="col flex flex-col gap-6">
      <h1 className="reveal">Art</h1>
      <ArtIndex sections={artSections} />
    </main>
  );
}
