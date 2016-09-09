import Chart from "./Chart";
import DateFormat from "sap/ui/core/format/DateFormat";

export default class AxisChart extends Chart {
    metadata = {
        aggregations: {
        	axes: { type: "sap.a.chart.axis.Axis", singularName: "axis" }
        },

        events: {
			contentClick: {
				parameters: {
					x: { type: "float" },
					y: { type: "float" }
				}
			}
		}
    };

    initChart()
	{
		super.initChart();
		this.addStyleClass("sap-a-axis-chart");
        this.$element.attr("tabindex", "0");  // Important! Make the chart have the ability to focus.

		this._initAxisLayer();
        this._initEvents();
	}

	_initAxisLayer()
	{
	    this.axisLayer = this.appendLayer();
        this.axisLayer.classed("axis-layer", true);
	    this.getAxes().forEach(axis => axis.attachToParentNode(this.axisLayer));
	}
    
    _initEvents()
    {
        const _svg_onmovestart = (interactionMode) => {
            d3.event.preventDefault();
            this._svg_onclick();
            this.svg.on(interactionMode + "move", _svg_onmoving);
            $(document.body).on(interactionMode === "touch" ? "touchend" : "mouseup", _svg_onmoveend);
        };
        const _svg_onmoving = () => {
            this._svg_onclick();
        };
        const _svg_onmoveend = () => {
            this.svg.on("touchmove", null);
            this.svg.on("mousemove", null);
            $(document.body).off("touchend");
            $(document.body).off("mouseup");
        };

        this.svg.on("mousedown", () => {
            _svg_onmovestart("mouse");
        });
        this.svg.on("touchstart", () => {
            _svg_onmovestart("touch");
        });
    }

	addAxis(axis)
	{
		this.addAggregation("axes", axis);

		if (this.axisLayer)
		{
            axis.attachToParentNode(this.axisLayer);
		}
	}

    redraw(transit)
    {
        super.redraw(transit);
        this.getAxes().forEach(axis => {
            axis.redraw(transit);
        });
    }

    _svg_onclick()
	{
		const coordinate = d3.mouse(this.svg.node());
    	const rX = coordinate[0] - this.getPadding().left; // Relative to contentGroup.
    	const rY = coordinate[1] - this.getPadding().top;  // Relative to contentGroup.
    	if (rX > 0 && rX < this.contentFrame.width && rY > 0 && rY < this.contentFrame.height)
    	{
    		this.fireContentClick({ x: rX, y: rY });
    	}
	}
}
