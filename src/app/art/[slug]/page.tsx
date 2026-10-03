import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArtSectionGallery from "@/components/art-gallery";
import {
  artSectionCount,
  artSectionSlug,
  artSections,
  getArtSection,
} from "@/data/art";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return artSections.map((section) => ({ slug: artSectionSlug(section) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const section = getArtSection((await params).slug);
  return { title: section ? `${section.name} · Lauren Yoo` : "Lauren Yoo" };
}

export default async function ArtSectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const section = getArtSection(slug);
  if (!section) notFound();

  const index = artSections.indexOf(section);
  const prev = artSections[index - 1];
  const next = artSections[index + 1];
  const count = artSectionCount(section);

  return (
    <main className="flex flex-col gap-10">
      <div className="col flex flex-col gap-1">
        <Link href="/art" className="reveal link link-muted self-start">
          ← art
        </Link>
        <h1 className="reveal flex items-baseline justify-between gap-6 pt-4" style={{ "--i": 1 } as React.CSSProperties}>
          <span>{section.name}</span>
          {count > 0 && <span className="muted tabular-nums">{count}</span>}
        </h1>
      </div>

      <div className="col">
        <ArtSectionGallery section={section} />
      </div>

      <nav className="col flex justify-between gap-6 pt-8 muted">
        {prev ? (
          <Link href={`/art/${artSectionSlug(prev)}`} className="link link-muted">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/art/${artSectionSlug(next)}`} className="link link-muted text-right">
            {next.name} →
          </Link>
        )}
      </nav>
    </main>
  );
}
