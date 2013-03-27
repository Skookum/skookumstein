(function(namespace, $) {

  var ns = window[namespace] = window[namespace] || {};

  var SCALE = 0.01;
  var CEILING_COLOR = '#ccc';
  var FLOOR_COLOR = '#543';

  function Viewport(canvasElement) {
    this._el = canvasElement;
    this._$el = $(canvasElement);
    this._$win = $(window);
    this._ctx = canvasElement.getContext('2d');
    this._ox = 0;
    this._oy = 0;

    this.resize();
    this.listen();
  }

  Viewport.prototype = {

    listen: function() {
      var self = this;
      this._$win.on('resize', function(e) {
        self.resize();
      });
    },

    resize: function() {
      this._$el.attr({
        width: this._$win.width(),
        height: this._$win.height()
      });
      this._ox = this._el.width * 0.5;
      this._oy = this._el.height * 0.5;
    },

    getSize: function() {
      return {
        width: this._el.width,
        height: this._el.height
      };
    },

    clear: function() {
      if (ns.Config.raycaster) {
        var grad = this._ctx.createLinearGradient(0, 0, 0, this._el.height);
        grad.addColorStop(0, CEILING_COLOR);
        grad.addColorStop(0.5, '#000');
        grad.addColorStop(1, FLOOR_COLOR);
        this._ctx.fillStyle = grad;
        this._ctx.fillRect(0, 0, this._el.width, this._el.height);
      }
      else {
        this._ctx.clearRect(0, 0, this._el.width, this._el.height);
      }
    },

    circle: function(x, y, r, color) {
      x += this._ox;
      y += this._oy;
      this._ctx.fillStyle = color;
      this._ctx.beginPath();
      this._ctx.arc(x, y, r, 0, Math.PI * 2);
      this._ctx.closePath();
      this._ctx.fill();
    },

    line: function(x0, y0, x1, y1, color) {
      x0 += this._ox;
      y0 += this._oy;
      x1 += this._ox;
      y1 += this._oy;
      this._ctx.strokeStyle = color;
      this._ctx.strokeWidth = 3;
      this._ctx.beginPath();
      this._ctx.moveTo(x0, y0);
      this._ctx.lineTo(x1, y1);
      this._ctx.stroke();
    },

    drawCenter: function() {
      var ox = this._ox;
      var oy = this._oy;
      this._ctx.strokeStyle = '#999';
      this._ctx.strokeWidth = 1;
      this._ctx.beginPath();
      this._ctx.moveTo(ox, oy - 10);
      this._ctx.lineTo(ox, oy + 10);
      this._ctx.moveTo(ox - 10, oy);
      this._ctx.lineTo(ox + 10, oy);
      this._ctx.stroke();
    },

    simpleCol: function(index, total, distance) {
      if (distance === Infinity) return;
      var width = this._el.width / total;
      var x = width * index;
      var height = this._el.height / (distance * SCALE);
      var y = (this._el.height - height) * 0.5;

      this._ctx.strokeStyle = '#ccc';
      this._ctx.strokeWidth = 1;
      this._ctx.fillStyle = '#888';
      this._ctx.beginPath();
      this._ctx.rect(x, y, width, height);
      this._ctx.fill();
      this._ctx.stroke();
    },

    litCol: function(index, total, distance) {
      if (distance === Infinity) return;
      var width = this._el.width / total;
      var x = width * index;
      var height = this._el.height / (distance * SCALE);
      var y = (this._el.height - height) * 0.5;
      var bright = Math.floor(255 * Math.max(0, Math.min(1, height / this._el.height)));

      this._ctx.fillStyle = 'rgba(' + bright + ',' + bright + ',' + bright + ',255)';
      this._ctx.fillRect(x, y, width + 1, height);
    },

    textureCol: function(index, total, distance, texture) {
      if (distance === Infinity) return;
      var width = this._el.width / total;
      var x = width * index;
      var height = this._el.height / (distance * SCALE);
      var y = (this._el.height - height) * 0.5;
      var bright = Math.floor(255 * Math.max(0, Math.min(1, height / this._el.height)));

      this._ctx.drawImage(texture, x, y, width + 1, height);
    }
  };

  ns.Viewport = Viewport;

})('skookum', jQuery);