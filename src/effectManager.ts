// src/canvas/effectManager.ts

export class EffectManager {
  fade = 0; // 0〜1
  fadeDir = 0; // 1: フェードアウト, -1: フェードイン, 0: 停止

  // 他のエフェクトもここに追加できる
  // shakeTime = 0;
  // flashTime = 0;

  update(dt: number) {
    // フェード処理
    if (this.fadeDir !== 0) {
      this.fade += this.fadeDir * dt * 0.002;
      this.fade = Math.max(0, Math.min(1, this.fade));

      if (this.fade === 0 || this.fade === 1) {
        this.fadeDir = 0;
      }
    }

    // 他のエフェクトもここに追加
    // if (this.shakeTime > 0) this.shakeTime -= dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // フェード描画
    if (this.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${this.fade})`;
      ctx.fillRect(0, 0, 1280, 720);
    }

    // 他のエフェクトもここに追加
    // if (this.shakeTime > 0) drawShake(ctx);
  }

  startFadeOut() {
    this.fadeDir = 1;
  }

  startFadeIn() {
    this.fadeDir = -1;
  }
}
