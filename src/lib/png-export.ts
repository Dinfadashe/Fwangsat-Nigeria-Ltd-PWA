"use client";
import { toPng } from "html-to-image";

/** Renders a DOM node (an invoice/receipt template) to a downloadable .png file. */
export async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  // Force the export to use the node's true full size, not whatever
  // portion happens to be visible inside a scrollable/clipped parent.
  const width = node.scrollWidth;
  const height = node.scrollHeight;

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    width,
    height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: "none",
    },
  });

  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = dataUrl;
  link.click();
}