import SuperMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

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
    }

    _initTileLayer()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);
    }
}
