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
            this.addSubview(this.mapView, this.$(">main"));
            this.addSubview(this.fab, this.$(">main"));
            this.mapView.invalidateSize();
        });
    }

    initLayout()
    {
        super.initLayout();
    }
}
