import Card from "./card";
import type { Card as CardType } from "./card";

type ProjectGridProps = {
  cards: CardType[];
};

export default function ProjectGrid({ cards }: ProjectGridProps) {
  return (
    <div>
      {/* Grid Layout - follows `cards` order left-to-right, top-to-bottom at every breakpoint */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
