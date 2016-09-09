import Series from "./Series";

export default class PieSeries extends Series {
	metadata = {
		properties: {
			innerRadius: { type: "float", defaultValue: 0 },
			outerRadius: { type: "float", defaultValue: 100 },
			animationDuration: { type: "int", defaultValue: 800 },
            valuePath: { type: "string", defaultValue: "value" },
            colorScale: { type: "object", defaultValue: d3.scale.category20() } // function
		}
	};

	initContainer()
	{
		super.initContainer();
		this.container.classed("pie-series", true);
		this._initArc();
		this._initPieLayout();
        this._initColorScale();
	}

	_initArc()
	{
		this.arc = d3.svg.arc()
			.innerRadius(this.getInnerRadius())
			.outerRadius(this.getOuterRadius());
	}

	_initPieLayout()
	{
		this.pieLayout = d3.layout.pie()
            .sort(null)
            .value(d => d[this.getValuePath()]);
	}
    
    _initColorScale()
    {
        this.colorScale = this.getColorScale();
    }

	redraw()
	{
        super.redraw();
		if (!this.normalizedData)
		{
			return;
		}
		this.slices = this.container.selectAll("path.arc")
			.data(this.pieLayout(this.normalizedData));
		this.slices.exit().remove();
		this.slices.enter()
			.append("path")
			.classed("arc", true)
            .style("fill", (d, i) => this.colorScale(i));
		this.slices.transition()
			.duration(this.getAnimationDuration())
			.attrTween("d", d => {
				const start = { startAngle: 0, endAngle: 0 };
				const interpolate = d3.interpolate(start, d);
				return (t => {
					return this.arc(interpolate(t));
				});
			});
	}

	translate(x, y)
	{
		this.container
			.transition()
			.duration(this.getAnimationDuration())
			.attr("transform", "translate(" + x + "," + y + ")");
	}
}
