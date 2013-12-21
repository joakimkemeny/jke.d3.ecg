/* global d3 */
(function ($, d3) {
	'use strict';

	$.widget('jke.ecgChart', {

		// Default options
		options: {
			margin: {
				top: 15,
				right: 15,
				bottom: 20,
				left: 40
			},
			height: 350,
			width: 500,
			xMin: 0,
			xMax: 500,
			yMin: -1.5,
			yMax: 2.0
		},

		_create: function () {
			var widget = this;

			// Create the SVG element to render the chart into.
			var svg = d3.select(widget.element[0]).append('svg')
					.classed('jke-ecgChart-background', true)
					.attr('height', widget.options.height)
					.attr('width', widget.options.width);

			// Adjust the dimensions to compensate for the margins.
			widget.options.height = widget.options.height - widget.options.margin.top - widget.options.margin.bottom;
			widget.options.width = widget.options.width - widget.options.margin.left - widget.options.margin.right;

			// Create a root canvas to put all elements into and move it according to the margins.
			// The extra 0.5 pixels is to avoid blur on retina screens.
			widget.canvas = svg
					.append('g')
					.attr('transform', 'translate(' + (widget.options.margin.left + 0.5) +
							',' + (widget.options.margin.top + 0.5) + ')');

			// Create a background for the chart area.
			widget.canvas.call(function (selection) {
				selection.append('rect')
						.classed('jke-ecgChart-background', true)
						.attr('height', widget.options.height)
						.attr('width', widget.options.width)
						.attr('x', 0).attr('y', 0);
			});

			// Create a scale for x-coordinates.
			widget.xScale = d3.scale.linear()
					.domain([widget.options.xMin, widget.options.xMax])
					.range([0, widget.options.width]);

			// Create a scale for the y-coordinates.
			widget.yScale = d3.scale.linear()
					.domain([widget.options.yMax, widget.options.yMin])
					.range([0, widget.options.height]);

			// Create the x-axis generator...
			widget.xAxisGenerator = d3.svg.axis()
					.scale(widget.xScale)
					.orient('bottom')
					.tickFormat('');

			// ...and add it to the canvas.
			widget.canvas
					.append('g')
					.classed('jke-ecgChart-axis', true)
					.attr('transform', 'translate(0,' + widget.options.height + ')')
					.call(widget.xAxisGenerator);

			// Create the y-axis...
			widget.yAxisGenerator = d3.svg.axis()
					.scale(widget.yScale)
					.orient('left')
					.tickFormat('');

			// ...and add it to the canvas.
			widget.canvas
					.append('g')
					.classed('jke-ecgChart-axis', true)
					.call(widget.yAxisGenerator);

			// Create a clipping mask to make sure that the chart don't escape.
			svg.call(function (selection) {
				selection
						.append('defs')
						.append('svg:clipPath')
						.attr('id', 'ecgChartClip')
						.append('svt:rect')
						.attr('x', 0).attr('y', 0)
						.attr('height', widget.options.height)
						.attr('width', widget.options.width);
			});

			// Create a line generator to use to create the line chart.
			widget.lineGenerator = d3.svg.line()
					.interpolate('cardinal')
					.x(function (d) { return widget.xScale(d.x); })
					.y(function (d) { return widget.yScale(d.y); });
		},

		_destroy: function () {
			this.element.remove('svg');
		},

		// Public method to update the data of the chart.
		updateData: function (data) {
			var widget = this;

			widget.canvas
					.append('g')
					.attr('clip-path', 'url(#ecgChartClip)')
					.append('path')
					.datum(data)
					.classed('jke-ecgChart-line', true)
					.attr('d', widget.lineGenerator);
		}
	});

})($, d3);
