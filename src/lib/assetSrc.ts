import type { StaticImageData } from "next/image";

/** URL string para <img src> com imports estáticos no Next.js */
export function assetSrc(img: string | StaticImageData): string {
  return typeof img === "string" ? img : img.src;
}
