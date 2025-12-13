module.exports = {
  theme: {
    extend: {
      screens: {
        xs: "320px",
        "sm-custom": "430px",
      },
      colors: {
        background: "var(--background)",
        black: "var(--black)",
        accent: "var(--accent)",
        gray: "var(--gray)",
        lightgray: "var(--light-gray)",
      },
      fontFamily: {
        title: ["Pecita"],
        body: ["Reddit Mono"],
      },
      objectFit: {
        none: "none",
      },
    },
  },
};
