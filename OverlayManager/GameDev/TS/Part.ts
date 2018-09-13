﻿class Part {
  images: any[];
  frameIndex: number;
  reverse: boolean;
  lastUpdateTime: any;
  frameCount: number;

  constructor(fileName: string, frameCount: number,
    private animationStyle: AnimationStyle,
    private offsetX: number,
    private offsetY: number,
    private frameRate = 100,
    private jiggleX?: number,
    private jiggleY?: number) {

    this.images = [];
    this.frameIndex = 0;
    this.reverse = false;
    this.lastUpdateTime = null;
    var actualFrameCount = 0;
    for (var i = 0; i < frameCount; i++) {
      var image = new Image();
      image.src = 'Assets/' + fileName + i + '.png';
      this.images.push(image);
      actualFrameCount++;
    }
    this.frameCount = actualFrameCount;
  }

  fileExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }

  isOnLastFrame() {
    return this.frameIndex == this.frameCount - 1;
  }

  isOnFirstFrame() {
    return this.frameIndex == 0;
  }

  advanceFrameIfNecessary() {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date();
      return;
    }

    var now: any = new Date();
    var msPassed = now - this.lastUpdateTime;
    if (msPassed < this.frameRate)
      return;

    if (this.animationStyle == AnimationStyle.Static)
      return;
    if (this.animationStyle == AnimationStyle.Random)
      this.frameIndex = Random.getInt(this.frameCount);

    if (this.reverse) {
      this.frameIndex--;
      if (this.frameIndex < 0)
        if (this.animationStyle == AnimationStyle.Sequential)
          this.frameIndex = 0;
        else // AnimationStyle.Loop
          this.frameIndex = this.frameCount - 1;
    }
    else {
      this.frameIndex++;
      if (this.frameIndex >= this.frameCount)
        if (this.animationStyle == AnimationStyle.Sequential)
          this.frameIndex = this.frameCount - 1;
        else // AnimationStyle.Loop
          this.frameIndex = 0;
    }

    this.lastUpdateTime = performance.now();
  }

  getJiggle(amount) {
    if (amount == 0 || !amount)
      return 0;
    return Random.between(-amount, amount + 1);
  }

  draw(context, x, y) {
    this.advanceFrameIfNecessary();
    this.drawByIndex(context, x, y, this.frameIndex);
  }

  drawByIndex(context, x, y, frameIndex) {
    context.drawImage(this.images[frameIndex],
      x + this.offsetX + this.getJiggle(this.jiggleX),
      y + this.offsetY + this.getJiggle(this.jiggleY));

  }
}