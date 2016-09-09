import View from "../view/View";

export default class Chart extends View
{
    metadata = {
        properties: {
            frame: { type: "object" },
            padding: { type: "object", defaultValue: { top: 0, right: 0, bottom: 0, left: 0 } }
        },
        aggregations: {
    		series: { type: "sap.a.chart.series.Series", singularName: "series" }
    	}
    };

    afterInit()
    {
        super.afterInit();
        this.updateContentFrame();
        this.initChart();
    }

    initChart()
    {
        this.addStyleClass("sap-a-chart");
        this._initSvg();
        this._initContentGroup();
        this._initSeriesLayer();
        this._initLegend();
    }

    _initSvg()
    {
        const $svg = $("<svg width=100% height=100% />");
        this.$element.append($svg);
        this.svg = d3.select($svg[0]);
    }

    _initContentGroup()
    {
        this.contentGroup = this.svg.append("g").classed("content", true);
        const padding = this.getPadding();
        this.contentGroup.attr("transform", `translate(${padding.left}, ${padding.top})`);
    }

    _initLegend()
    {
        this.legendGroup = this.svg.append("g")
            .classed("legend", true)
            .style("opacity", 0);
    }
    
    // Chart has at least one layer: seriesLayer
    _initSeriesLayer()
    {
        this.seriesLayer = this.appendLayer();
        this.seriesLayer.classed("series-layer", true);
        this.getSeries().forEach(series => series.attachToParentNode(this.seriesLayer));
    }
    
    // Append series to series layer
    addSeries(series)
    {
        if(this.seriesLayer) {
            this.addAggregation("series", series);
            series.attachToParentNode(this.seriesLayer);
        }
    }

    appendLayer()
    {
        let layer = this.contentGroup.append("g").classed("layer", true);
        return layer;
    }

    redraw(transit)
    {
        if (!this.contentFrame)
        {
            return;
        }
        
        this._redrawTimeout = null;

        const series = this.getSeries();
        series.forEach(s => {
            s.redrawOnce(transit);
        });
    }

    redrawOnce(transit)
    {
        if (this._redrawTimeout)
        {
            clearTimeout(this._redrawTimeout);
            this._redrawTimeout = null;
        }
        this._redrawTimeout = setTimeout(this.redraw.bind(this, transit), 200);
    }

    invalidateSize()
    {
        const originalContentSize = JSON.stringify(this.contentFrame);
        this.updateContentFrame();
        if (this.contentFrame && JSON.stringify(this.contentFrame) !== originalContentSize)
        {
            this.redrawOnce(false);
        }
    }

    updateContentFrame()
    {
        const frame = this.getFrame();
        if (frame)
        {
            this.contentFrame = {
                width: frame.width - this.getPadding().left - this.getPadding().right,
                height: frame.height - this.getPadding().top - this.getPadding().bottom
            };
        }
        else
        {
            if (this.getParent())
            {
                this.contentFrame = {
                    width: this.$element.width() - this.getPadding().left - this.getPadding().right,
                    height: this.$element.height() - this.getPadding().top - this.getPadding().bottom
                };
            }
            else
            {
                this.contentFrame = null;
            }
        }
    }
}
