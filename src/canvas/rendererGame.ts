import { assets } from "./assets";
import type { Screen, Settings, HoverUI, CardID } from "../GameCanvas";

export function renderGame(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  screen: Screen,
  effectTimers: Record<string, number>,
  dt: number,
  hoverStates: HoverUI,
  settingsRef: Settings,
) {}
