import Chart from "./Chart";

export default class DonutChart extends Chart
{
    initChart()
    {
        super.initChart();
        this.addStyleClass("sap-a-pie-chart");
        this._initSeriesLayer();
    }

    _initSeriesLayer()
    {
        this.seriesLayer = this.appendLayer().classed("series-layer", true);
	    this.getSeries().forEach(series => series.attachToParentNode(this.seriesLayer));
    }

    addSeries(series)
    {
        if (this.seriesLayer)
		{
            series.attachToParentNode(this.seriesLayer);
		}
    }
}
