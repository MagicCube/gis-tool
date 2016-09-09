import ManagedObject from "sap/ui/base/ManagedObject";

export default class Series extends ManagedObject
{
    metadata = {
        properties: {
            data: { type: "object", bindable: true },
            dataNormalizer: { type: "any", defaultValue: d => d },
            scaleX: { type: "any" },
            scaleY: { type: "any" }
        }
    };

    attachToParentNode(parentNode)
    {
        this.container = parentNode.append("g");
        this.initContainer();
    }

    initContainer()
    {
        this.container.classed("series", true);
        this.container.attr("id", this.getId());
    }

    getSeriesGroupNode()
    {
        return this.container.node();
    }

    setData(data)
    {
        this.setProperty("data", data);
        if (!data)
        {
            return;
        }
        this.normalizedData = this.getDataNormalizer()(data);
        this.redrawOnce();
    }

    redraw()
    {
        this._redrawTimeout = null;
    }
    
    redrawOnce(transit)
    {
        if (this._redrawTimeout)
        {
            clearTimeout(this._redrawTimeout);
            this._redrawTimeout = null;
        }
        this._redrawTimeout = setTimeout(this.redraw.bind(this, transit), 100);
    }

    show()
    {
        if (this.container)
        {
            this.container
                .transition()
                .style("opacity", 1);
        }
    }

    hide()
    {
        if (this.container)
        {
            this.container
                .transition()
                .style("opacity", 0);
        }
    }
    
    toggle(visible)
    {
        if (visible)
        {
            this.show();
        }
        else 
        {
            this.hide();
        }
    }
}
