import Series from "./Series";

export default class AreaSeries extends Series {
	metadata = {
		properties: {
            xPath: { type: "string", defaultValue: "x" },
            y0Path: { type: "string", defaultValue: "y0" },
            y1Path: { type: "string", defaultValue: "y1" },
            fillColor: { type: "string", defaultValue: "white" },
            opacity: { type: "float", defaultValue: 1 },
            transitionDuration: { type: "int", defaultValue: 800 },
		}
	}

	initContainer()
	{
		super.initContainer();
        this.container.classed("area-series", true);
		this._initArea();
	}

	_initArea()
	{
        this.area = d3.svg.area();
		this.areaPath = this.container
            .append("path")
            .classed("area", true);
	}

	redraw(transit = true)
	{
        super.redraw(transit);
        if (!this.normalizedData) {        
            return;
        }

        this.getScaleX().range([0, this.getParent().contentFrame.width]);
        this.getScaleY().range([this.getParent().contentFrame.height, 0]);

        this.area
			.x(d => this.getScaleX()(this._getPathValue(d, this.getXPath())))
			.y0(d => this.getScaleY()(this._getPathValue(d, this.getY0Path()) || 0))
			.y1(d => this.getScaleY()(this._getPathValue(d, this.getY1Path())));
        
        if (transit)
		{
			this.areaPath
                .transition()
                .duration(this.getTransitionDuration());
		}
		this.areaPath.attr("d", this.area(this.normalizedData))
            .style("opacity", this.getOpacity())
            .style("fill", this.getFillColor());
	}

    _getPathValue(data, path, separator = "/")
    {
    	const paths = path.split(separator);
    	return paths.reduce((preValue, currentValue) => preValue[currentValue], data);
    }
}
