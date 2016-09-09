import Series from "./Series";

export default class WordCloudSeries extends Series
{
    metadata = {
        properties: {
            data: { type: "object", bindable: true },
            minValue: { type: "float", defaultValue: 0 },
            maxValue: { type: "float", defaultValue: 100 },
            minFontSize: { type: "float", defaultValue: 16 },
            maxFontSize: { type: "float", defaultValue: 32 }
        },
    };
    
    attachToParentNode(parentNode)
    {
        this.container = parentNode.append("g");
        this.initContainer();
    }
    
    initContainer()
    {
        this.container.classed("word-cloud-series", true);
        this._initScales();
    }
    
    _initScales()
    {
        this.colorScale = d3.scale.category20();
        this.fontSizeScale = d3.scale.linear()
            .domain([this.getMinValue(), this.getMaxValue()])
            .range([this.getMinFontSize(), this.getMaxFontSize()]);
    }

    redraw()
    {
        super.redraw();
        this._updataMinMaxValue();
        this._updataFontSizeScale();
        if (this.normalizedData)
        {
            const contentFrame = this.getParent().contentFrame;
            const deepCopyOfNormalizedData = this.normalizedData.map(data => ({
                text: data.text,
                size: data.size
            }));
            this.container.attr("transform", `translate(${contentFrame.width / 2}, ${contentFrame.height / 2 })`)
            d3.layout.cloud()
                .size([contentFrame.width, contentFrame.height])
                .words(deepCopyOfNormalizedData)
                .rotate(() => Math.random() > 0.5 ? 0 : 90)
                .font("Microsoft YaHei")
                .fontSize(d => this.fontSizeScale(d.size))
                .on("end", this._drawWordCloud.bind(this))
                .start();
        }
    }

    _drawWordCloud(data)
    {
        this.container
            .selectAll("text")
            .remove();
            
        this.container
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Microsoft YaHei")
            .style("fill", (d, i) => this.colorScale(i))
            .style("stroke-width", 0)
            .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .attr("text-anchor", "middle")
            .text(d => d.text);
    }
    
    _updataMinMaxValue()
    {
        if (!this.normalizedData)
        {
            return;
        }
        let minValue = this.normalizedData[0].size;
        let maxValue = this.normalizedData[0].size;
        this.normalizedData.forEach(datum => {
            minValue = datum.size < minValue ? datum.size : minValue;
            maxValue = datum.size > maxValue ? datum.size : maxValue;
        });
        this.setMinValue(minValue);
        this.setMaxValue(maxValue);
    }
    
    _updataFontSizeScale()
    {
        const factor = this.getParent().contentFrame.height > 720 ? 2 : 1;
        this.fontSizeScale
            .range([this.getMinFontSize() * factor, this.getMaxFontSize() * factor]);
    }

    setMinValue(value)
    {
        this.setProperty("minValue", value);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.domain([value, this.getMaxValue()]);
        }
    }

    setMaxValue(value)
    {
        this.setProperty("maxValue", value);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.domain([this.getMinValue(), value]);
        }
    }

    setMinFontSize(value)
    {
        this.setProperty("minFontSize", value);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.range([value, this.getMaxFontSize()]);
        }
    }

    setMaxFontSize(value)
    {
        this.setProperty("maxFontSize", value);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.range([this.getMinFontSize(), value]);
        }
    }
}
