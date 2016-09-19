import Application from "sap/a/app/Application";
import SplitLayout from "sap/a/layout/SplitLayout";
import SuperScene from "sap/a/scn/Scene";

import FloatActionButton from "../view/FloatActionButton";

export default class Scene extends SuperScene
{
    metadata = {
        properties: {
            displayFab: { type: "boolean", defaultValue: true }
        }
    };

    init()
    {
        super.init();
        this.$element.append(`<aside/><main/>`);
    }

    afterInit()
    {
        super.afterInit();
        this.mapView = Application.getInstance().mapView;
        this.fab = new FloatActionButton();
        this.attachActivated(() => {
            this.addSubview(this.mapView, this.$(">main"));
            this.addSubview(this.fab, this.$(">main"));
            
            const id = this.getId();
            this.mapView.toggleLayer(this.mapView.corridorLayer, id === "corridorScene");
            this.mapView.toggleLayer(this.mapView.keyRouteLayer, id === "keyRouteScene");
            this.mapView.toggleLayer(this.mapView.wayLayer, id === "wayScene");
            
            this.mapView.invalidateSize();
        });
    }

    initLayout()
    {
        super.initLayout();
    }
}
