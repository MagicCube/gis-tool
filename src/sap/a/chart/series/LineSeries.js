import Series from "./Series";

export default class LineSeries extends Series {
	metadata = {
		properties: {
			xPath: { type: "string", defaultValue: "x" },
			yPath: { type: "string", defaultValue: "y" },
			dashed: { type: "boolean" , defaultValue: false },
			opacity: { type: "float", defaultValue: 1 },
            transitionDuration: { type: "int", defaultValue: 800 }
		}
	}

	initContainer()
	{
		super.initContainer();
        this.container.classed("line-series", true);
		this._initLine();
	}

	_initLine()
	{
        this.line = d3.svg.line();
		this.linePath = this.container
            .append("path")
            .classed("line", true);
		this.linePath.classed("dashed", this.getDashed());
	}

	redraw(transit = true)
	{
		super.redraw(transit);
        if (!this.normalizedData) {        
            return;
        }

        this.getScaleX().range([0, this.getParent().contentFrame.width]);
        this.getScaleY().range([this.getParent().contentFrame.height, 0]);
        this.line
			.x((d) => this.getScaleX()(this._getPathValue(d, this.getXPath())))
			.y((d) => this.getScaleY()(this._getPathValue(d, this.getYPath())));

        if (transit)
        {
            this.linePath
                .transition()
                .duration(this.getTransitionDuration());
        }
        this.linePath.attr("d", this.line(this.normalizedData))
            .style("opacity", this.getOpacity());
	}

	setDashed(dashed)
	{
		this.setProperty("dashed", dashed);
		if (this.linePath)
		{
			this.linePath.classed("dashed", dashed);
		}
	}

    _getPathValue(data, path, separator = "/")
    {
    	const paths = path.split(separator);
    	return paths.reduce((preValue, currentValue) => preValue[currentValue], data);
    }
}
