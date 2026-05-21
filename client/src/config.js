export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://snozo-s-fashion-store-xty4.vercel.app/api"
    : "http://localhost:5000/api";