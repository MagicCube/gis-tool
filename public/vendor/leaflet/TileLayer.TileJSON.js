L.TileLayer.TileJSON = L.TileLayer.Canvas.extend({
	options: {
		debug: false,
		url: null,
		style: null,
		preprocess: null,
		loadCallBack: null
	},

	tileSize: 256,

	initialize: function(options) {
		var opt = L.Util.setOptions(this, options);

		this._url = opt.url;

		this.drawTile = function(canvas, tilePoint, zoom) {
			var ctx = {
				canvas: canvas,
				tile: tilePoint,
				zoom: zoom
			};

			if (this.options.debug) {
				this._drawDebugInfo(ctx);
			}
			this._draw(ctx);
		};
	},

	setStyle: function(style) {
		this.options.style = style;
	},

	setLoadCallBack: function(callback) {
		this.options.loadCallBack = callback;
	},

	setPreProcess: function(p_preprocess) {
		this.options.preprocess = p_preprocess;
	},

	_drawDebugInfo: function(ctx) {
		var max = this.tileSize;
		var g = ctx.canvas.getContext('2d');
		g.strokeStyle = '#000000';
		g.fillStyle = '#FFFF00';
		g.strokeRect(0, 0, max, max);
		g.font = "12px Arial";
		g.fillRect(0, 0, 5, 5);
		g.fillRect(0, max - 5, 5, 5);
		g.fillRect(max - 5, 0, 5, 5);
		g.fillRect(max - 5, max - 5, 5, 5);
		g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
		g.strokeText(ctx.tile.x + ' ' + ctx.tile.y + ' ' + ctx.zoom, max / 2 - 30, max / 2 - 10);
	},

	_tilePoint: function(ctx, coords) {
		// start coords to tile 'space'
		var s = ctx.tile.multiplyBy(this.tileSize);

		// actual coords to tile 'space'
		if (this._map) {
			var p = this._map.project(new L.LatLng(coords[1], coords[0]));

			// point to draw
			var x = p.x - s.x;
			var y = p.y - s.y;
			return {
				x: x,
				y: y
			};
		}
	},

	_clip: function(ctx, points) {
		var nw = ctx.tile.multiplyBy(this.tileSize);
		var se = nw.add(new L.Point(this.tileSize, this.tileSize));
		var bounds = new L.Bounds([
			nw, se
		]);
		var len = points.length;
		var out = [];

		for (var i = 0; i < len - 1; i++) {
			var seg = L.LineUtil.clipSegment(points[i], points[i + 1], bounds, i);
			if (!seg) {
				continue;
			}
			out.push(seg[0]);
			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((seg[1] !== points[i + 1]) || (i === len - 2)) {
				out.push(seg[1]);
			}
		}
		return out;
	},

	_isActuallyVisible: function(coords) {
		var coord = coords[0];
		var min = [
			coord.x, coord.y
		], max = [
			coord.x, coord.y
		];
		for (var i = 1; i < coords.length; i++) {
			coord = coords[i];
			min[0] = Math.min(min[0], coord.x);
			min[1] = Math.min(min[1], coord.y);
			max[0] = Math.max(max[0], coord.x);
			max[1] = Math.max(max[1], coord.y);
		}
		var diff0 = max[0] - min[0];
		var diff1 = max[1] - min[1];
		if (this.options.debug) {
			console.log(diff0 + ' ' + diff1);
		}
		var visible = diff0 > 1 || diff1 > 1;
		return visible;
	},

	_drawPoint: function(ctx, geom, style, properties) {
		if (!style || this._map === null || typeof this._map === 'undefined') {
			return;
		}

		var p = this._tilePoint(ctx, geom);
		var c = ctx.canvas;
		var g = c.getContext('2d');
		g.beginPath();
		g.fillStyle = style.color;
		g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
		g.closePath();
		g.fill();
		g.restore();
	},

	_drawLineString: function(ctx, geom, style, properties) {
		if (!style || this._map === null || typeof this._map === 'undefined') {
			return;
		}
		var coords = geom, proj = [], i;
		for (i = 0; i < coords.length; i++) {
			proj.push(this._tilePoint(ctx, coords[i]));
		}

		var preprocess = this.options.preprocess;

		if ($.isFunction(preprocess)) {
			proj = preprocess.apply(this, [
				proj, properties
			]);
		}

		var g = ctx.canvas.getContext('2d');
		g.strokeStyle = style.color;
		g.lineWidth = style.weight;

		g.beginPath();
		for (i = 0; i < proj.length; i++) {
			var method = (i === 0 ? 'move' : 'line') + 'To';
			g[method](proj[i].x, proj[i].y);
		}
		g.stroke();
		g.restore();
	},

	_drawPolygon: function(ctx, geom, style, properties) {
		if (!style || this._map === null || typeof this._map === 'undefined') {
			return;
		}

		for (var el = 0; el < geom.length; el++) {
			var coords = geom[el], proj = [], i;
			// coords = this._clip(ctx, coords);
			for (i = 0; i < coords.length; i++) {
				proj.push(this._tilePoint(ctx, coords[i]));
			}
			if (!this._isActuallyVisible(proj)) {
				continue;
			}

			var g = ctx.canvas.getContext('2d');
			var outline = style.outline;
			g.fillStyle = style.color;
			if (outline) {
				g.strokeStyle = outline.color;
				g.lineWidth = outline.size;
			}
			g.beginPath();
			for (i = 0; i < proj.length; i++) {
				var method = (i === 0 ? 'move' : 'line') + 'To';
				g[method](proj[i].x, proj[i].y);
			}
			g.closePath();
			g.fill();
			if (outline) {
				g.stroke();
			}
		}
	},

	_draw: function(ctx) {
		var nwPoint = ctx.tile.multiplyBy(this.tileSize);
		var sePoint = nwPoint.add(new L.Point(this.tileSize, this.tileSize));

		// optionally, enlarge request area.
		// with this I can draw points with coords outside this tile area,
		// but with part of the graphics actually inside this tile.
		// NOTE: that you should use this option only if you're actually drawing points!
		var buf = this.options.buffer;
		if (buf > 0) {
			var diff = new L.Point(buf, buf);
			nwPoint = nwPoint.subtract(diff);
			sePoint = sePoint.add(diff);
		}

		var nwCoord = this._map.unproject(nwPoint, ctx.zoom, true);
		var seCoord = this._map.unproject(sePoint, ctx.zoom, true);
		var bounds = [
			nwCoord.lng, seCoord.lat, seCoord.lng, nwCoord.lat
		];
		var url = this._url;

		if ($.isFunction(url)) {
			url = url.apply(this, [
				bounds, ctx
			]);
		}

		if (url === null || typeof url === 'undefined')
		{
			return;
		}

        // NOTE: this is the only part of the code that depends from external libraries (actually, jQuery only).
		var loader = null;
        if (this.hasCached(url))
        {
            loader = this.cacheLoader.bind(this);
        }
        else
        {
            loader = $.ajax;
        }
		loader({
			dataType: "json",
			url: url,
            cache: true,
            ctx: ctx,
			success: this._fetch_callback.bind(this, ctx, url)
        });
	},

    hasCached: function(url)
    {
        return this.cache && this.cache[url];
    },

    cacheLoader: function(options)
    {
        const data = this.cache[options.url];
        this._fetch_callback(options.ctx, options.url, data);
    },

    cacheData: function(url, data)
    {
        if (!this.cache)
        {
            this.cache = [];
        }
        if (this.cache[url])
        {
            var index = this.cache.indexOf(this.cache[url]);
            this.cache.splice(index, 1);
        }
        else
        {
            this.cache[url] = data;
        }
        this.cache.unshift(data);

        if (this.cache.length > 1000)
        {
            this.cache.splice(999);
        }
    },

    _fetch_callback: function(ctx, url, data) {
        this.cacheData(url, data);

        for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];
            var style = this.options.style;
            if ($.isFunction(style)) {
                style = style.apply(this, [
                    feature
                ]);
            }

            var type = feature.geometry.type;
            var geom = feature.geometry.coordinates;
            var properties = feature.properties;
            var len = geom.length;
            switch (type) {
                case 'Point':
                    this._drawPoint(ctx, geom, style, properties);
                    break;

                case 'MultiPoint':
                    for (var j = 0; j < len; j++) {
                        this._drawPoint(ctx, geom[j], style, properties);
                    }
                    break;

                case 'LineString':
                    this._drawLineString(ctx, geom, style, properties);
                    break;

                case 'MultiLineString':
                    for (var j = 0; j < len; j++) {
                        this._drawLineString(ctx, geom[j], style, properties);
                    }
                    break;

                case 'Polygon':
                    this._drawPolygon(ctx, geom, style, properties);
                    break;

                case 'MultiPolygon':
                    for (var j = 0; j < len; j++) {
                        this._drawPolygon(ctx, geom[j], style, properties);
                    }
                    break;

                default:
                    throw new Error('Unmanaged type: ' + type);
            }
        }

        var callback = this.options.loadCallBack;
        if ($.isFunction(callback)) {
            callback.call(this, [
                data
            ]);
        }
    }
});
