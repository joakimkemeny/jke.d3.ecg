/* global d3 */
(function ($, d3) {
	'use strict';

	$.widget('jke.ecgChart', {

		// Default options
		options: {

			margin: {
				top: 0,
				right: 1,
				bottom: 10,
				left: 10
			},

			height: 450,
			width: 600,

			xMin: 0,
			xMax: 3000,
			xMajorTicks: 1000,

			yMin: -1,
			yMax: 1.5
		},

		_create: function () {
			var widget = this;

			// Create the SVG element to render the chart into.
			widget.svg = d3.select(widget.element[0]).append('svg')
					.attr('height', widget.options.height)
					.attr('width', widget.options.width);

			// Adjust the dimensions to compensate for the margins.
			widget.options.height = widget.options.height - widget.options.margin.top - widget.options.margin.bottom;
			widget.options.width = widget.options.width - widget.options.margin.left - widget.options.margin.right;


			// Create a root canvas to put all elements into and move it according to the margins.
			// The extra 0.5 pixels is to avoid blur on retina screens.
			widget.canvas = widget.svg
					.append('g')
					.attr('transform', 'translate(' +
							(widget.options.margin.left + 0.5) + ',' +
							(widget.options.margin.top + 0.5) + ')');

			// Create a background for the chart area.
			widget.canvas.call(function (selection) {
				widget.background = selection.append('rect')
						.classed('jke-ecgChart-background', true)
						.attr('height', widget.options.height)
						.attr('width', widget.options.width)
						.attr('x', 0).attr('y', 0);
			});


			// Create a scale for the y-coordinates.
			widget.yScale = d3.scale.linear()
					.domain([widget.options.yMax, widget.options.yMin])
					.range([0, widget.options.height]);

			// Create a scale for x-coordinates.
			widget.xScale = d3.scale.linear()
					.domain([widget.options.xMin, widget.options.xMax])
					.range([0, widget.options.width]);


			// Create the y-axis.
			widget.yAxisGenerator = d3.svg.axis()
					.scale(widget.yScale)
					.orient('left')
					.ticks(4)
					.tickFormat('');
			widget.yAxis = widget.canvas
					.append('g')
					.classed('jke-ecgChart-axis-y', true)
					.call(widget.yAxisGenerator);

			// Create a horizontal grid.
			widget.yGridGenerator = d3.svg.axis()
					.scale(widget.yScale)
					.orient('left')
					.ticks(4)
					.tickSize(-widget.options.width)
					.tickFormat('');
			widget.yGrid = widget.canvas
					.append('g')
					.classed('jke-ecgChart-grid-y', true)
					.call(widget.yGridGenerator);


			// Create the x-axis.
			widget.xAxisGenerator = d3.svg.axis()
					.scale(widget.xScale)
					.orient('bottom')
					.ticks(this.options.xMax / this.options.xMajorTicks)
					.tickFormat('');
			widget.xAxis = widget.canvas
					.append('g')
					.classed('jke-ecgChart-axis-x', true)
					.attr('transform', 'translate(0,' + widget.options.height + ')')
					.call(widget.xAxisGenerator);

			// Create a vertical grid.
			widget.xGridGenerator = d3.svg.axis()
					.scale(widget.xScale)
					.orient('top')
					.ticks(this.options.xMax / this.options.xMajorTicks)
					.tickSize(-widget.options.height)
					.tickFormat('');
			widget.xGrid = widget.canvas
					.append('g')
					.classed('jke-ecgChart-grid-x', true)
					.call(widget.xGridGenerator);


			// Create a clipping mask to make sure that the chart don't escape.
			widget.svg.call(function (selection) {
				widget.clipMask = selection
						.append('defs')
						.append('svg:clipPath')
						.attr('id', 'ecgChartClip')
						.append('svt:rect')
						.attr('x', 0).attr('y', 0)
						.attr('height', widget.options.height)
						.attr('width', widget.options.width);
			});

			// Create the line.
			widget.data = [];
			widget.lineGenerator = d3.svg.line()
					.interpolate('cardinal')
					.x(function (d) { return widget.xScale(d.x); })
					.y(function (d) { return widget.yScale(d.y); });
			widget.line = widget.canvas
					.append('g')
					.attr('clip-path', 'url(#ecgChartClip)')
					.append('path')
					.datum(widget.data)
					.classed('jke-ecgChart-line', true)
					.attr('d', widget.lineGenerator);
		},

		_destroy: function () {
			this.element.remove('svg');
		},

		_redraw: function () {
			var widget = this;
			widget.line.attr('d', widget.lineGenerator);
		},


		// Public API to change the settings and data after the chart is created.

		addDataPoint: function (value) {
			var widget = this;

			// Create a point within range.
			var point = {
				x: value.x % this.options.xMax,
				y: value.y
			};

			// Check if we need to clear the line before starting.
			if (widget.lastX && widget.lastX > point.x) {
				widget.data.length = 0;
			}
			widget.lastX = point.x;

			widget.data.push(point)
			this._redraw();
		}
	});

})($, d3);
