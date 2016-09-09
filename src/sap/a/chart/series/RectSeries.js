import Series from "./Series";

export default class RectSeries extends Series
{
    metadata = {
        properties: {
            domainX: { type: "object" },    // array, such as [7, 9]
            domainY: { type: "object" },     // array, such as [0, 100]
            opacity: { type: "float", defaultValue: 0.8 },
            fill: { type: "string", defaultValue: "#F0F0F0" }
        }
    };

    initContainer()
    {
        super.initContainer();
        this.container.classed("rect-series", true);
        this._initRect();
    }

    _initRect()
    {
        this.rect = this.container.append("rect");
    }

    redraw()
    {
        super.redraw();
        const size = this._getSize();
        if (!size) {
            return;
        }
        const { width, height, offsetX, offsetY } = size;
        this.rect
            .attr("x", offsetX)
            .attr("y", offsetY)
            .attr("width", width)
            .attr("height", height)
            .style("opacity", this.getOpacity())
            .style("fill", this.getFill());
    }


    _getSize()
    {
        const parent = this.getParent();
        if (parent && parent.contentFrame && parent.contentFrame.width &&
            parent.contentFrame.height && parent.getScaleX() && parent.getScaleY())
        {
            const scaleX = parent.getScaleX();
            const scaleY = parent.getScaleY();
            let width = parent.contentFrame.width;
            let height = parent.contentFrame.height;
            let offsetX = 0;
            let offsetY = 0;
            if (Array.isArray(this.getDomainX()) && this.getDomainX().length === 2)
            {
                width = Math.abs(scaleX(this.getDomainX()[1]) - scaleX(this.getDomainX()[0]));
                offsetX = scaleX(this.getDomainX()[0]);
            }
            if (Array.isArray(this.getDomainY()) && this.getDomainY().length === 2)
            {
                height = Math.abs(scaleX(this.getDomainY()[1]) - scaleX(this.getDomainY()[0]));
                offsetY = scaleY(this.getDomainY()[1]);
            }
            return { width, height, offsetX, offsetY };
        }

        return null;
    }
}
