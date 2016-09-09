import SuperApplication from "sap/a/app/Application";

import MapView from "../map/MapView";

export default class Application extends SuperApplication
{
    init()
    {
        super.init();
        this._initMapView();
    }

    _initMapView()
    {
        this.mapView = new MapView({
            minZoom: 3,
            defaultZoom: 4
        });
        this.addSubview(this.mapView);
        $(() => {
            this.mapView.invalidateSize();
        });
    }
}
