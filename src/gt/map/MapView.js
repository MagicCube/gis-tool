import SuperMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import RouteLayer from "./layer/RouteLayer";
import OsmServiceClient from "../service/OsmServiceClient";

export default class MapView extends SuperMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("gt-map-view");

        OsmServiceClient.getInstance()
            .getRoute([[31.9785192, 118.756434338897], [32.051007361253916,118.77885818481445]])
            .then(res => {
                this.routeLayer.drawRoute(res);
            });
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
