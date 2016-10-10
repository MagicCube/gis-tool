import SuperMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import BoundLayer from "./layer/BoundLayer";
import RouteLayer from "./layer/RouteLayer";

export default class MapView extends SuperMapView
{
    metadata = {
        properties: {
            minZoom: { defaultValue: 8 }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("gt-map-view");

        this.$element.on("dragover", this._ondragover.bind(this));
        this.$element.on("drop", this._ondrop.bind(this));
    }

    initLayers()
    {
        super.initLayers();
        this._initTileLayer();
        this._initRouteLayer();
    }

    _initTileLayer()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);
    }

    _initRouteLayer()
    {
        this.boundLayer = new BoundLayer();
        this.addLayer(this.boundLayer);
        this.hideLayer(this.boundLayer);

        this.corridorLayer = new RouteLayer();
        this.addLayer(this.corridorLayer);
        this.hideLayer(this.corridorLayer);

        this.keyRouteLayer = new RouteLayer();
        this.addLayer(this.keyRouteLayer);
        this.hideLayer(this.keyRouteLayer);

        this.wayLayer = new RouteLayer();
        this.addLayer(this.wayLayer);
        this.hideLayer(this.wayLayer);
    }

    _initBoundLayer()
    {
        this.boundLayer = new BoundLayer();
        this.addLayer(this.boundLayer);
        this.hideLayer(this.boundLayer);
    }





    getActiveLayer()
    {
       if (this.corridorLayer.isVisible())
       {
           return this.corridorLayer;
       }

       if (this.keyRouteLayer.isVisible())
       {
           return this.keyRouteLayer;
       }

       if (this.wayLayer.isVisible())
       {
           return this.wayLayer;
       }
    }





    _ondragover(e)
    {
        e.preventDefault();

        const layer = this.getActiveLayer();
        if (!layer) return;

        e = e.originalEvent;
        if (this.draggingPosition && e.screenX === this.draggingPosition.x && e.screenY === this.draggingPosition.y)
        {
            return;
        }
        this.draggingPosition = { x: e.screenX, y: e.screenY };
        e.latLng = this.map.mouseEventToLatLng(e);
        e.dataTransfer.dropEffect = "move";

        layer.onExternalDragOver(e);
        return true;
    }

    _ondrop(e)
    {
        const layer = this.getActiveLayer();
        if (!layer) return;

        e = e.originalEvent;

        layer.onExternalDrop(e);
    }
}
