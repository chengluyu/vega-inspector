module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.tsx", "./src/**/*.jsx"],
  theme: {
    extend: {},
    inset: {
      0: 0,
      4: "1rem",
      "1/2": "50%",
      auto: "auto",
    },
  },
  variants: {},
  plugins: [],
};
