import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent {

  @ViewChild('myCanvas') canvas: any;

  canvasElement: any;
  lastX: number;
  lastY: number;
  imageHistory = [];

  currentColour: string = '#000';
  brushSize: number = 1;

  constructor(public platform: Platform, public renderer: Renderer) {
    console.log('Hello CanvasDraw Component');
  }

  ngAfterViewInit() {

    this.canvasElement = this.canvas.nativeElement;

    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');

    this.pushImage();
  }

  handleStart(ev) {

    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev) {

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;

  }

  clearCanvas() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.pushImage();
  }

  undoLastStroke() {
    let ctx = this.canvasElement.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.drawImage(img, 0, 0);
    };
    this.imageHistory.pop();
    if (this.imageHistory.length > 0) {
      img.src = this.imageHistory.slice(-1)[0];
    }
  }

  pushImage() {
    if (this.imageHistory.length > 100) {
      this.imageHistory.shift();
    }
    this.imageHistory.push(this.canvasElement.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  }
}
