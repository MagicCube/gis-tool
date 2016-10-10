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
        this.$element.append(`
            <aside />
            <main />
            <div class="overlay" />
        `);
    }

    afterInit()
    {
        super.afterInit();
        this.mapView = Application.getInstance().mapView;
        this.fab = new FloatActionButton();
        this.attachActivated(() => {
            const id = this.getId();
            this.addSubview(this.mapView, this.$(">main"));

            this.mapView.toggleLayer(this.mapView.boundLayer, id === "cityScene");
            this.mapView.toggleLayer(this.mapView.corridorLayer, id === "corridorScene");
            this.mapView.toggleLayer(this.mapView.keyRouteLayer, id === "keyRouteScene");
            this.mapView.toggleLayer(this.mapView.wayLayer, id === "wayScene");
            this.mapView.invalidateSize();

            if (id === "cityScene")
            {
                this.mapView.boundLayer.fitBounds();
            }
            else
            {
                this.addSubview(this.fab, this.$(">main"));
            }
        });
    }

    initLayout()
    {
        super.initLayout();
    }

    showOverlay()
    {
        this.$(".overlay").css({
            display: "block"
        }).transition({
            opacity: 0.5
        });
    }

    hideOverlay()
    {
        this.$(".overlay").transition({
            opacity: 0
        }).css({
            display: "none"
        });
    }
}
