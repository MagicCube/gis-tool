import SplitLayout from "sap/a/layout/SplitLayout";
import SuperApplication from "sap/a/app/Application";

import AppBar from "../view/AppBar";
import MapView from "../map/MapView";

export default class Application extends SuperApplication
{
    init()
    {
        super.init();
        this._initAppBar();
        this._initMapView();
    }

    initLayout()
    {
        this.setLayout(new SplitLayout({
            ratio: [ 50, undefined ]
        }));
    }

    _initAppBar()
    {
        this.appBar = new AppBar({
            title: "SAP Traffic Map Tools"
        });
        this.addSubview(this.appBar);
    }

    _initMapView()
    {
        this.mapView = new MapView();
    }
}
