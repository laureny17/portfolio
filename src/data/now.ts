// ============================================
// NOW: the "02 Now" section on the index
// ============================================
// Leave a field empty ([] or "") to hide its row.
// ("listening" is live from Spotify; see src/app/api/now-playing/route.ts)
// ============================================

export const now = {
  based: "Cambridge, MA",

  taking: [
    { number: "6.5820", name: "Computer Networks (grad)" },
    { number: "6.1810", name: "Operating Systems" },
    { number: "6.1852", name: "Computer Systems and Society (grad)" },
    { number: "24.211", name: "Theory of Knowledge" },
    { number: "21G.907", name: "Korean VII" },
    { number: "24.917", name: "ConLangs" },
  ],

  // Shown as-is, e.g. "training for __" or "__ miles so far this year"
  running: "",
};
