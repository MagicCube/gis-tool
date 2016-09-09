import ManagedObject from "sap/ui/base/ManagedObject";

export default class Axis extends ManagedObject
{
	metadata = {
		properties: {
			domain: { type: "object", defaultValue: [0, 100] },
            innerTickSize: { type: "float", defaultValue: 0 },
			orient: { type: "string", defaultValue: "bottom" },
			outerTickSize: { type: "float", defaultValue: 0 },
            range: { type: "object", defaultValue: [0, 300] },
			ticks: { type: "int", defaultValue: 2 },
            tickFormat: { type: "any", defaultValue: d => d }, // function
			tickPadding: { type: "float", defaultValue: 5},
            tickSize: { type: "float", defaultValue: 1 },
			tickValues: { type: "object" },
            transitionDuration: { type: "int", defaultValue: 800 },
            unit: { type: "string", defaultValue: "" }
		}
	};

    attachToParentNode(parentNode)
    {
        this.axisGroup = parentNode.append("g")
            .style("opacity", 0);
        this.initAxis();
    }

	initAxis()
	{
		this.axisGroup
            .classed("axis", true)
            .attr("id", this.getId());
		this.unitText = this.axisGroup.append("text")
			.text(this.getUnit())
            .attr("dx", this.getRange()[1])
            .attr("dy", "1em");
        this.scale = d3.scale.linear().domain(this.getDomain()).range(this.getRange());
		this.axis = d3.svg.axis()
			.scale(this.scale)
			.orient(this.getOrient())
			.tickSize(this.getTickSize())
			.innerTickSize(this.getInnerTickSize())
			.outerTickSize(this.getOuterTickSize())
			.ticks(this.getTicks())
			.tickPadding(this.getTickPadding())
			.tickFormat(this.getTickFormat());
	}

    getAxisGroupNode()
    {
        return this.axisGroup.node();
    }

    getScale()
    {
        return this.scale;
    }

	setDomain(domain)
	{
		this.setProperty("domain", domain);
		if (Array.isArray(domain) && domain.length === 2)
		{
            this.updateScale();
        }
	}

    setRange(range)
    {
        this.setProperty("range", range);
        if (Array.isArray(range) && range.length === 2)
		{
			this.updateScale();
		}
    }

	setOrient(orient)
	{
		this.setProperty("orient", orient);
		if (this.axis)
		{
			this.axis.orient(orient);
		}
	}

	setTickSize(tickSize)
	{
		this.setProperty("tickSize", tickSize);
		if (this.axis)
		{
			this.axis.tickSize(tickSize);
		}
	}

	setOuterTickSize(outerTickSize)
	{
		this.setProperty("outerTickSize", outerTickSize);
		if (this.axis)
		{
			this.axis.outerTickSize(outerTickSize);
		}
	}

	setInnerTickSize(innerTickSize)
	{
		this.setProperty("innerTickSize", innerTickSize);
		if (this.axis)
		{
			this.axis.innerTickSize(innerTickSize);
		}
	}

	setTicks(ticks)
	{
		this.setProperty("ticks", ticks);
		if (this.axis)
		{
			this.axis.ticks(ticks);
		}
	}

	setTickPadding(tickPadding)
	{
		this.setProperty("tickPadding", tickPadding);
		if (this.axis)
		{
			this.axis.tickPadding(tickPadding);
		}
	}

	setTickFormat(tickFormat)
	{
		this.setProperty("tickFormat", tickFormat);
		if (this.axis)
		{
			this.axis.tickFormat(tickFormat);
		}
	}

	setTickValues(tickValues)
	{
		this.setProperty("tickValues", tickValues);
		if (this.axis)
		{
			this.axis.tickValues(tickValues);
		}
	}

    setUnit(unit = "")
	{
		this.setProperty("unit", unit);
		if (this.unitText)
		{
			this.unitText.text(unit);
		}
	}


    redraw(transit)
    {
        this.axisGroup.style("opacity", 1);
        this.unitText.attr("dx", this.getRange()[1]);
        if (transit)
        {
            this.axisGroup
                .transition()
                .duration(this.getTransitionDuration());
        }
        this.axisGroup.call(this.axis);
    }

    translate(x, y)
    {
        this.axisGroup.attr("transform", `translate(${x}, ${y})`);
    }

    updateScale()
    {
        if (this.scale && this.axis)
        {
            this.scale.domain(this.getDomain()).range(this.getRange());
            this.axis.scale(this.scale);
        }
    }

    addStyleClass(styleClass)
    {
        if (this.axisGroup)
        {
            this.axisGroup.classed(styleClass, true);
        }
    }
}
