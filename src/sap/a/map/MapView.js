import Layer from "./layer/Layer";
import View from "../view/View";

export default class MapView extends View
{
    metadata = {
		properties: {
			defaultCenterLocation: {
				type: "object",
                defaultValue: [ 32.04389, 118.77881 ]
			},
			defaultZoom: {
				type: "int",
				defaultValue: 12
			},
			minZoom: {
				type: "int",
				defaultValue: 11
			},
			maxZoom: {
				type: "int",
				defaultValue: 17
			},
			allowZoom: {
				type: "boolean",
				defaultValue: true
			},
			allowDrag: {
				type: "boolean",
				defaultValue: true
			}
		},

        aggregations: {
            layers: { type: "sap.a.map.layer.Layer" }
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("sap-a-map-view");
    }

    afterInit()
    {
        super.afterInit();
        this._initMap();
        this.initLayers();
    }

    initLayers()
    {

    }

    _initMap()
    {
        const options = {
            zoomControl: true,
			attributionControl: false,
			center: this.getDefaultCenterLocation(),
			zoom: this.getDefaultZoom(),
			minZoom: this.getMinZoom(),
			maxZoom: this.getMaxZoom(),
			dragging: this.getAllowDrag(),
			scrollWheelZoom: this.getAllowZoom(),
			doubleClickZoom: this.getAllowZoom()
        };
        this.map = L.map(this.$element[0], options);
    }



    getCenterLocation()
	{
		return this.map.getCenter();
	}

	setCenterLocation(centerLocation, zoom, options)
	{
		this.map.setView(centerLocation, zoom, options);
	}


    getBounds()
	{
		return this.map.getBounds();
	}

	setBounds(bounds)
	{
		this.map.fitBounds(bounds);
	}


    getZoom()
	{
		return this.map.getZoom();
	}

	setZoom(zoom)
	{
		this.map.setZoom(zoom);
	}

    setView(centerLocation, zoom)
    {
        this.map.setView(centerLocation, zoom);
    }


    addLayer(layer)
    {
        this.addAggregation("layers", layer);
        this.map.addLayer(layer.container);
        return this;
    }

    removeLayer(layer)
    {
        const result = this.removeAggregation("layers", layer);
        if (result)
        {
            this.map.removeLayer(layer.container);
        }
        return result;
    }

    removeAllLayers()
    {
        while (this.getLayers().length > 0)
        {
            this.getLayers()[0].removeFromParent();
        }
    }

    destroyLayers(suppressInvalidate)
    {
        this.removeAllLayers();
        this.destroyAggregation("layers", suppressInvalidate);
    }

    showLayer(layer)
    {
        if (!layer instanceof Layer || layer.getParent() !== this) return;
        if (!layer.isVisible())
        {
            this.map.addLayer(layer.container);
        }
    }

    hideLayer(layer)
    {
        if (!layer instanceof Layer || layer.getParent() !== this) return;
        if (layer.isVisible())
        {
            this.map.removeLayer(layer.container);
        }
    }

    toggleLayer(layer, shown)
    {
        if (arguments.length === 1)
        {
            shown = !layer.isVisible();
        }
        shown ? this.showLayer(layer) : this.hideLayer(layer);
    }




    invalidateSize(...args)
    {
        this.map.invalidateSize(...args);
    }
}
