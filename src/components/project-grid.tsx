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
      cards.forEach((card, index) => {
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
    <div className="relative px-8 sm:px-8 md:px-12 lg:px-12 xl:px-20">
      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-6">
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
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                className="absolute top-4 right-4 text-2xl hover:opacity-70 transition-opacity"
                onClick={() => setSelectedCard(null)}
              >
                ×
              </button>
              <Card card={selectedCard} className="!px-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
