"use client";

import { useState, useEffect } from "react";
import Card from "./card";
import type { Card as CardType } from "./card";

type ProjectGridProps = {
  cards: CardType[];
};

export default function ProjectGrid({ cards }: ProjectGridProps) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [columns, setColumns] = useState<CardType[][]>([[], [], []]);

  useEffect(() => {
    const updateColumns = () => {
      const newColumns: CardType[][] = [[], [], []];
      cards.forEach((card) => {
        // Distribute cards based on their height to create a more balanced layout
        const shortestColumn = newColumns.reduce(
          (shortest, current, i) =>
            current.length < newColumns[shortest].length ? i : shortest,
          0
        );
        newColumns[shortestColumn].push(card);
      });
      setColumns(newColumns);
    };

    updateColumns();
  }, [cards]);

  return (
    <div>
      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {column.map((card) => (
              <div
                key={card.id}
                className="cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
              <button
              className="absolute top-2 right-6 text-2xl hover:opacity-70 transition-opacity z-10"
                onClick={() => setSelectedCard(null)}
              >
                ×
              </button>
            <div className="p-6">
              <Card card={selectedCard} className="!px-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
