import path from "path";

export const root = path.resolve.bind(null, __dirname, "..");
export const src = path.join.bind(null, root(), "src");
export const dist = path.join.bind(null, root(), "dist");
