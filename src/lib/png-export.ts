"use client";

import { toPng } from "html-to-image";

/** Renders a DOM node (an invoice/receipt template) to a downloadable .png file. */
export async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
  });

  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = dataUrl;
  link.click();
}
