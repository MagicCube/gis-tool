import SuperMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import RouteLayer from "./layer/RouteLayer";
import ServiceClient from "../service/OsmServiceClient";

export default class MapView extends SuperMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("gt-map-view");

        const serviceClient = new ServiceClient();
        serviceClient.getRoute([[32.04389, 118.77881], [31.97746, 118.75621]]).then(res => {
            this.routeLayer.drawRoute(res);
        })
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
        this.routeLayer = new RouteLayer({

        });
        this.addLayer(this.routeLayer);
    }
}
