
export default class Bar {
    constructor () {
        //TODO
        this.animatePercent = 100;
        this.curentAnimatePercent = 0;
        this.animation = true;
    }

    static init (dom) {
        let bar = new Bar();
        bar._init(dom);
        return bar
    }

    _init(dom) {
        if (!dom) {
            throw Error('container node is empty');
        }
        let canvas = this.canvas = document.createElement('canvas');
        this.width = dom.offsetWidth;
        this.height = dom.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');
        dom.appendChild(this.canvas);
    }

    //初始化参数
    _initLayout () {
        this.marginTop = this.options.grid ? this.options.grid.top || 50 : 50;
        this.marginRight = this.options.grid ? this.options.grid.right || 50 : 50;
        this.marginBottom = this.options.grid ? this.options.grid.bottom || 50 : 50;
        this.marginLeft = this.options.grid ? this.options.grid.left || 50 : 50;

        //绘图区域大小
        this.innerWidth = this.width - this.marginLeft - this.marginRight;
        this.innerHeight = this.height - this.marginTop - this.marginBottom;

        //画笔原点
        this.x0 = this.marginLeft;
        this.y0 = this.width - this.marginBottom;

        this.legendH = this.marginTop;

        //X轴间距
        this.xGap = this.innerWidth / (this.options.xAxis.data.length + 1);
        this.maxY = null;
        this.lastSeriesPosition = [];
    }

    setOptions (options) {
        if (!!!options) {
            throw Error('options is undefined or null')
        }
        this.options = JSON.parse(JSON.stringify(options));
        this.animation = this.options.animation;
        this.curentAnimatePercent = 0;
        //初始化布局参数
        this._initLayout();
        //画图
        this.render(this.options);
    }

    render (options) {
        //清空
        this.clear(0, 0, this.width, this.height);
        //画X轴
        this.xAxis(this.ctx, options.xAxis, this.x0, this.y0, this.innerWidth);
        //画Y轴
        this.yAxios(this.ctx, options.yAxis, this.x0, this.y0, this.marginTop, this.innerHeight);
        //画图例
        this.legend(this.ctx, options.legend, this.width, this.legendH);
        //画系列
        this.serieses(this.ctx, options.series, this.x0, this.y0, options.xAxis, this.xGap, this.innerHeight);  
    }

    legend(ctx, legend, canvasW, legendH) {
        var lastPosttion = 0;
        //计算legend总宽度
        var legendAllWidth = 0;
    
        for (var i = 0; i < legend.length; i++) {
            //根据legen字体个数加上图例宽度，再加多个legend之间的宽度
            legendAllWidth += legend[i].name.split('').length * parseInt(legend[i].fontSize) + legend[i].width * 3;
        }
    
        legend.forEach(function (item, index) {
            var x = (canvasW + legendAllWidth) / 2 - ((index + 1) * (legendAllWidth / legend.length));
            var y = (legendH - parseInt(item.fontSize)) / 2;
    
            ctx.textBaseline = 'top';
            ctx.textAlign = "start";
            ctx.fillStyle = item.background;
            ctx.fillRect(x, y, item.width, item.height);
            ctx.fillText(item.name, x + item.width * 2, item.y);
        });
    }
    
    xAxis(ctx, xAxis, x0, y0, innerWidth) {
        //标签Y轴方向偏移
        var offsetY = 20;
    
        ctx.beginPath();
        var len = xAxis.data.length;
        var gap = innerWidth / (len + 1);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + innerWidth, y0);
        ctx.lineWidth = 1;
        ctx.strokeStyle = xAxis.color;
        ctx.stroke();
        ctx.closePath();
    
        ctx.fillStyle = xAxis.color;
        for (var i = 0; i < len; i++) {
            var x = gap * (i + 1) + x0;
            ctx.fillText(xAxis.data[i], x, y0 + offsetY);
            //第一个刻度不画
            // if (i != 0) {
            ctx.moveTo(x, y0);
            ctx.lineTo(x, y0 + xAxis.splitWidth);
            // }
            ctx.stroke();
        }
    }
    
    yAxios(ctx, yAxis, x0, y0, marginTop, innerHeight) {
        //标签x轴偏移量
        var offsetX = 10;
        //刻度宽度
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, marginTop);
        ctx.stroke();
        var spliteNum = Math.ceil(yAxis.max / yAxis.interval);
        var index = 0;
        var yLabel = [];

        while (index < spliteNum) {
            if (index === 0) {
                yLabel.push(yAxis.min);
            } else {
                yLabel.push(yAxis.min + yAxis.interval * index);
            }
            index++;
        }
    
        this.maxY = Math.max.apply(Math, yLabel);
        var gap = innerHeight / (yLabel.length - 1);
    
        for (var i = 0; i < yLabel.length; i++) {
            var y = y0 - gap * i;
            //y轴坐标最小值
            if (y < marginTop) {
                break;
            }
            ctx.font = yAxis.fontSize + 'px' + ' ' + yAxis.fontFamily;
            ctx.textAlign = "end";
            ctx.textBaseline = "middle";
            ctx.fillStyle = yAxis.color;
            ctx.fillText(yLabel[i], x0 - offsetX, y);
            //画刻度
            ctx.moveTo(x0, y);
            if (i != 0) {
                ctx.lineTo(x0 - yAxis.splitWidth, y);
            }
            ctx.lineWidth = 1;
            ctx.strokeStyle = yAxis.color || 'red';
            ctx.stroke();
            ctx.closePath();
        }
    }

    getH (y, h,index) {
        if (this.lastSeriesPosition[index]) {
            return  this.lastSeriesPosition[index] - h;
        } else {
            return y - h;
        }
    }
    
    serieses(ctx, series, x0, y0, xAxis, xGap, innerHeight) {
        for (let i = 0; i < series.length; i++) {
            //系列x轴偏移量
            var offsetX = series[0].width / 2;
            let h = 0;
            //绘制系列
            for (let j = 0; j < series[i].data.length; j++) {
                var persent = series[i].data[j] / this.maxY;
                var x = x0 + (j + 1) * xGap - offsetX;
                if (this.animation) {
                    h = Math.ceil(innerHeight * persent * this.curentAnimatePercent / this.animatePercent);
                    // h = Math.ceil(innerHeight * persent);
                } else {
                    h = Math.ceil(innerHeight * persent);
                }
                this.ctx.fillStyle = series[i].background;
                this.drawRect(ctx, x,  this.getH (y0, h, j) , series[i].width, h);
                this.lastSeriesPosition[j] = y0 - h ;
            }
        }
        this.lastSeriesPosition = [];
        if (this.curentAnimatePercent < this.animatePercent && this.animation) {
            this.curentAnimatePercent++;
            this.animator = requestAnimationFrame(function () {
                // console.log(`执行动画${this.curentAnimatePercent}%`);
                this.clear(this.marginLeft+1, this.marginTop,
                     this.width - this.marginLeft - this.marginRight, 
                     this.height - this.marginBottom - this.marginTop);
                this.serieses(this.ctx, series, this.x0, this.y0, this.xAxis, this.xGap, this.innerHeight);
            }.bind(this));
        } else {
            // console.log('终止动画')
            cancelAnimationFrame(this.animator);
        }
    }

    drawRect(ctx, x, y, width, height, mouseMove ) {
        ctx.save();
        ctx.beginPath();
        ctx.rect( x, y, width, height);
        
        if(mouseMove && ctx.isPointInPath(mousePosition.x*2, mousePosition.y*2)){ //如果是鼠标移动的到柱状图上，重新绘制图表
            ctx.fillStyle = "green";
            
        }else{
            // ctx.fillStyle = gradient;
            // ctx.strokeStyle = gradient;
        }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    
    clear (x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
    }
}