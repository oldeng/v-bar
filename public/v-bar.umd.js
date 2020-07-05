(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.array.for-each'), require('core-js/modules/es.function.name'), require('core-js/modules/web.dom-collections.for-each'), require('core-js/modules/es.array.fill'), require('core-js/modules/es.regexp.exec'), require('core-js/modules/es.string.split')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.array.for-each', 'core-js/modules/es.function.name', 'core-js/modules/web.dom-collections.for-each', 'core-js/modules/es.array.fill', 'core-js/modules/es.regexp.exec', 'core-js/modules/es.string.split'], factory) :
  (global = global || self, factory(global['v-bar'] = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Bar = /*#__PURE__*/function () {
    function Bar() {
      _classCallCheck(this, Bar);

      //TODO
      this.animatePercent = 100;
      this.curentAnimatePercent = 0;
      this.animation = true;
    }

    _createClass(Bar, [{
      key: "_init",
      value: function _init(dom) {
        if (!dom) {
          throw Error('container node is empty');
        }

        var canvas = this.canvas = document.createElement('canvas');
        this.width = dom.offsetWidth;
        this.height = dom.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        dom.appendChild(this.canvas);
      } //初始化参数

    }, {
      key: "_initLayout",
      value: function _initLayout() {
        this.marginTop = this.options.grid ? this.options.grid.top || 50 : 50;
        this.marginRight = this.options.grid ? this.options.grid.right || 50 : 50;
        this.marginBottom = this.options.grid ? this.options.grid.bottom || 50 : 50;
        this.marginLeft = this.options.grid ? this.options.grid.left || 50 : 50; //绘图区域大小

        this.innerWidth = this.width - this.marginLeft - this.marginRight;
        this.innerHeight = this.height - this.marginTop - this.marginBottom; //画笔原点

        this.x0 = this.marginLeft;
        this.y0 = this.width - this.marginBottom;
        this.legendH = this.marginTop; //X轴间距

        this.xGap = this.innerWidth / (this.options.xAxis.data.length + 1);
        this.maxY = null;
        this.lastSeriesPosition = [];
      }
    }, {
      key: "setOptions",
      value: function setOptions(options) {
        if (!!!options) {
          throw Error('options is undefined or null');
        }

        this.options = JSON.parse(JSON.stringify(options));
        this.animation = this.options.animation;
        this.curentAnimatePercent = 0; //初始化布局参数

        this._initLayout(); //画图


        this.render(this.options);
      }
    }, {
      key: "render",
      value: function render(options) {
        //清空
        this.clear(0, 0, this.width, this.height); //画X轴

        this.xAxis(this.ctx, options.xAxis, this.x0, this.y0, this.innerWidth); //画Y轴

        this.yAxios(this.ctx, options.yAxis, this.x0, this.y0, this.marginTop, this.innerHeight); //画图例

        this.legend(this.ctx, options.legend, this.width, this.legendH); //画系列

        this.serieses(this.ctx, options.series, this.x0, this.y0, options.xAxis, this.xGap, this.innerHeight);
      }
    }, {
      key: "legend",
      value: function legend(ctx, _legend, canvasW, legendH) {

        var legendAllWidth = 0;

        for (var i = 0; i < _legend.length; i++) {
          //根据legen字体个数加上图例宽度，再加多个legend之间的宽度
          legendAllWidth += _legend[i].name.split('').length * parseInt(_legend[i].fontSize) + _legend[i].width * 3;
        }

        _legend.forEach(function (item, index) {
          var x = (canvasW + legendAllWidth) / 2 - (index + 1) * (legendAllWidth / _legend.length);
          var y = (legendH - parseInt(item.fontSize)) / 2;
          ctx.textBaseline = 'top';
          ctx.textAlign = "start";
          ctx.fillStyle = item.background;
          ctx.fillRect(x, y, item.width, item.height);
          ctx.fillText(item.name, x + item.width * 2, item.y);
        });
      }
    }, {
      key: "xAxis",
      value: function xAxis(ctx, _xAxis, x0, y0, innerWidth) {
        //标签Y轴方向偏移
        var offsetY = 20;
        ctx.beginPath();
        var len = _xAxis.data.length;
        var gap = innerWidth / (len + 1);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + innerWidth, y0);
        ctx.lineWidth = 1;
        ctx.strokeStyle = _xAxis.color;
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = _xAxis.color;

        for (var i = 0; i < len; i++) {
          var x = gap * (i + 1) + x0;
          ctx.fillText(_xAxis.data[i], x, y0 + offsetY); //第一个刻度不画
          // if (i != 0) {

          ctx.moveTo(x, y0);
          ctx.lineTo(x, y0 + _xAxis.splitWidth); // }

          ctx.stroke();
        }
      }
    }, {
      key: "yAxios",
      value: function yAxios(ctx, yAxis, x0, y0, marginTop, innerHeight) {
        //标签x轴偏移量
        var offsetX = 10; //刻度宽度

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
          var y = y0 - gap * i; //y轴坐标最小值

          if (y < marginTop) {
            break;
          }

          ctx.font = yAxis.fontSize + 'px' + ' ' + yAxis.fontFamily;
          ctx.textAlign = "end";
          ctx.textBaseline = "middle";
          ctx.fillStyle = yAxis.color;
          ctx.fillText(yLabel[i], x0 - offsetX, y); //画刻度

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
    }, {
      key: "getH",
      value: function getH(y, h, index) {
        if (this.lastSeriesPosition[index]) {
          return this.lastSeriesPosition[index] - h;
        } else {
          return y - h;
        }
      }
    }, {
      key: "serieses",
      value: function serieses(ctx, series, x0, y0, xAxis, xGap, innerHeight) {
        for (var i = 0; i < series.length; i++) {
          //系列x轴偏移量
          var offsetX = series[0].width / 2;
          var h = 0; //绘制系列

          for (var j = 0; j < series[i].data.length; j++) {
            var persent = series[i].data[j] / this.maxY;
            var x = x0 + (j + 1) * xGap - offsetX;

            if (this.animation) {
              h = Math.ceil(innerHeight * persent * this.curentAnimatePercent / this.animatePercent); // h = Math.ceil(innerHeight * persent);
            } else {
              h = Math.ceil(innerHeight * persent);
            }

            this.ctx.fillStyle = series[i].background;
            this.drawRect(ctx, x, this.getH(y0, h, j), series[i].width, h);
            this.lastSeriesPosition[j] = y0 - h;
          }
        }

        this.lastSeriesPosition = [];

        if (this.curentAnimatePercent < this.animatePercent && this.animation) {
          this.curentAnimatePercent++;
          this.animator = requestAnimationFrame(function () {
            // console.log(`执行动画${this.curentAnimatePercent}%`);
            this.clear(this.marginLeft + 1, this.marginTop, this.width - this.marginLeft - this.marginRight, this.height - this.marginBottom - this.marginTop);
            this.serieses(this.ctx, series, this.x0, this.y0, this.xAxis, this.xGap, this.innerHeight);
          }.bind(this));
        } else {
          // console.log('终止动画')
          cancelAnimationFrame(this.animator);
        }
      }
    }, {
      key: "drawRect",
      value: function drawRect(ctx, x, y, width, height, mouseMove) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);

        if (mouseMove && ctx.isPointInPath(mousePosition.x * 2, mousePosition.y * 2)) {
          //如果是鼠标移动的到柱状图上，重新绘制图表
          ctx.fillStyle = "green";
        }

        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }, {
      key: "clear",
      value: function clear(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
      }
    }], [{
      key: "init",
      value: function init(dom) {
        var bar = new Bar();

        bar._init(dom);

        return bar;
      }
    }]);

    return Bar;
  }();

  //
  var script = {
    name: 'VBar',
    methods: {
      setOptions: function setOptions(options) {
        this.bar.setOptions(options);
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.$nextTick(function () {
        _this.bar = Bar.init(_this.$refs['bar']);
      });
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  var __vue_script__ = script;
  /* template */

  var __vue_render__ = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c("div", {
      ref: "bar",
      staticClass: "v-bar"
    });
  };

  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;
  /* style */

  var __vue_inject_styles__ = undefined;
  /* scoped */

  var __vue_scope_id__ = "data-v-749b20a2";
  /* module identifier */

  var __vue_module_identifier__ = undefined;
  /* functional template */

  var __vue_is_functional_template__ = false;
  /* style inject */

  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__ = /*#__PURE__*/normalizeComponent({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

  var components = [__vue_component__];

  var install = function install(Vue) {
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  };

  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  exports.VBar = __vue_component__;
  exports.default = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
