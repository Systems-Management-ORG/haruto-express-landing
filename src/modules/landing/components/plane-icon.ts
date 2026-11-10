// The airliner drawn on the flight paths: Material Symbols "flight" (rounded, filled),
// Apache License 2.0, https://fonts.google.com/icons. Drawn nose-up in a 960-unit box whose
// origin sits at the bottom-left (viewBox 0 -960 960 960).
export const PLANE_PATH =
  "M409-421 137-311q-20 8-38.5-4T80-350v-18q0-11 5-19.5T98-402l311-219v-188q0-29 21-50t50-21q29 0 50 21t21 50v188l311 219q8 6 13 14.5t5 19.5v18q0 23-18.5 35t-38.5 4L551-421v172l109 76q7 5 11 12.5t4 15.5v19q0 17-13.5 27.5T631-93l-151-46-151 46q-17 5-30.5-5.5T285-126v-19q0-8 4-15.5t11-12.5l109-76v-172Z";

// Centres the plane on the origin, scales it to `size` units across and turns the nose to +x,
// the direction CSS offset-path (offset-rotate: auto) and motion paths treat as "forward".
export const planeTransform = (size: number) => `rotate(90) scale(${(size / 960).toFixed(4)}) translate(-480 480)`;
