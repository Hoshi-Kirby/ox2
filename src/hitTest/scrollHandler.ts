import type { Settings } from "../types";
type ScrollParams = {
  canvas: HTMLCanvasElement;
  settingsRef: Settings;
};

export function createScrollHandler({ canvas, settingsRef }: ScrollParams) {
  let lastY = 0;

  canvas.addEventListener("wheel", (e) => {
    if (settingsRef.ui.deviceMode !== "mouse") return;
    settingsRef.ui.scrollY += e.deltaY;
  });

  canvas.addEventListener("touchstart", (e) => {
    lastY = e.touches[0].clientY;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (settingsRef.ui.deviceMode !== "touch") return;
    const y = e.touches[0].clientY;
    settingsRef.ui.scrollY += lastY - y;
    lastY = y;
  });
}
