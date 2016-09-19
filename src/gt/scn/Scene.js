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

        this.fab = new FloatActionButton();
    }

    afterInit()
    {
        super.afterInit();

        this.mapView = Application.getInstance().mapView;
        this.attachActivated(() => {
            const id = this.getId();
            this.addSubview(this.mapView, this.$(">main"));
            
            if (id !== "cityScene")
            {
                this.addSubview(this.fab, this.$(">main"));
            }
            
            this.mapView.toggleLayer(this.mapView.boundLayer, id === "cityScene");
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
