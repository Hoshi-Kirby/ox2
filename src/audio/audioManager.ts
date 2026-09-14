import { seOverlapList } from "./assets.ts";

let currentBgm: HTMLAudioElement | null = null;

export function playBgm(bgm: HTMLAudioElement) {
  if (currentBgm === bgm) return;

  if (currentBgm) {
    currentBgm.pause();
    currentBgm.currentTime = 0;
  }

  currentBgm = bgm;
}

export function startBgm() {
  if (currentBgm) currentBgm.play();
}

export function stopBgm() {
  if (currentBgm) currentBgm.pause();
}

const seMap: Record<string, HTMLAudioElement> = {};

export function loadSe(name: string, path: string) {
  const audio = new Audio(path);
  audio.preload = "auto";
  seMap[name] = audio;
}

import { audioAssets } from "./assets";

export function playSe(name: keyof typeof audioAssets) {
  const audio = audioAssets[name];
  if (!audio) return;

  if (seOverlapList.includes(name)) {
    const clone = audio.cloneNode(true) as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.currentTime = 0;
    clone.play();
  } else {
    audio.currentTime = 0;
    audio.play();
  }
}
