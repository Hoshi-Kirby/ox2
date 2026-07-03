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
