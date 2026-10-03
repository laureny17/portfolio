// ============================================
// NOW: the "02 Now" section on the index
// ============================================
// Edit this file, push, and the site updates on redeploy.
// Leave a field empty ([] or "") to hide its row.
// ("listening" is live from Spotify; see src/app/api/now-playing/route.ts)
// ============================================

export const now = {
  based: "Cambridge, MA",

  taking: [
    { number: "6.5820", name: "Computer Networks (grad)" },
    { number: "6.1810", name: "Operating Systems" },
    { number: "6.1852", name: "Computer Systems and Society (grad)" },
    { number: "6.1600", name: "Computer Security" },
    { number: "24.211", name: "Theory of Knowledge" },
    { number: "21G.907", name: "Korean VII" },
    { number: "24.917", name: "ConLangs" },
  ],

  // Shown as-is, e.g. "training for the Boston Marathon" or "312 miles so far this year"
  running: "",
};
