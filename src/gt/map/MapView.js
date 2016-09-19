import SuperMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import RouteLayer from "./layer/RouteLayer";

export default class MapView extends SuperMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("gt-map-view");
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
}
