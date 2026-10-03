// Guest star colors, each paired with a note. The notes are a major pentatonic
// scale (C D E G A C D), so any stars clicked in any order sound nice together.
// Index in this array is what gets stored, so only append; don't reorder.

export type StarColor = {
  name: string;
  color: string; // pigment
  edge: string; // pooled pigment at the rim
  note: string;
  freq: number; // Hz
};

export const STAR_PALETTE: StarColor[] = [
  { name: "red", color: "#e8817a", edge: "#c85a53", note: "C", freq: 523.25 },
  { name: "rose", color: "#f2a7a0", edge: "#d97e76", note: "D", freq: 587.33 },
  { name: "salmon", color: "#f7bea6", edge: "#e2967a", note: "E", freq: 659.25 },
  { name: "citron", color: "#dde28c", edge: "#adb44a", note: "G", freq: 783.99 },
  { name: "blue", color: "#b3c6fa", edge: "#7894e6", note: "A", freq: 880.0 },
  { name: "sky", color: "#c4d8fb", edge: "#8aabe9", note: "C", freq: 1046.5 },
  { name: "beige", color: "#e7d7b6", edge: "#bda672", note: "D", freq: 1174.66 },
];
