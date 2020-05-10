
export class PointsLayout {
    constructor(ctx) {
        this.ctx = ctx;
    }

    atScale = (currentK) => {
        this.currentK = currentK;
        return this
    }

    // drawGlow = (visible) => {
    //     const radiusScale = 1.5;
    //     this.hiddenCtx.fillStyle = "white";
    //     visible.forEach((d) => {
    //         if (d.highlight)
    //             this.drawPoint(d, this.hiddenCtx, radiusScale)
    //     })

    //     if (isChrome) { //Only chrome seems to be able to handle it at the moment
    //         this.ctx.save();
    //         let filter = `blur(7px) saturate(110%) brightness(110%) `;
    //         this.ctx.filter = filter;
    //     }
    //     this.ctx.drawImage(this.hiddenCanvas, 0, 0);
    //     if (isChrome)
    //         this.ctx.restore();
    // }

    drawPoint = (d, context, radiusScale = 1) => {
        context.beginPath();
        context.arc(d.cx, d.cy, radiusScale * d.radius / this.currentK, 0, 2 * Math.PI);
        context.fill();
    }

    drawPoints = (visible) => {
        let prevColor = null
        visible.sort((d) => d.color).forEach(d => {
            if (d.color != prevColor) {
                this.ctx.fillStyle = d.color;
                prevColor = d.color;
            }
            this.drawPoint(d, this.ctx)
        })
    }
}