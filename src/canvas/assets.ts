// src/canvas/assets.ts
const cache: Record<string, HTMLImageElement> = {};

export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    if (cache[path]) {
      resolve(cache[path]);
      return;
    }

    const img = new Image();
    img.src = path;

    img.onload = () => {
      cache[path] = img;
      resolve(img);
    };
  });
}

export const assets = {
  titleBg: loadImage("/assets/city_scene.png"),
};
