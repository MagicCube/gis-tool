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

    afterInit()
    {
        super.afterInit();

        this.mapView = Application.getInstance().mapView;
        this.fab = new FloatActionButton();
        this.attachActivated(() => {
            this.addSubview(this.mapView, this.$(">.sub-container:nth-child(2)"));
            this.addSubview(this.fab, this.$(">.sub-container:nth-child(2)"));
            this.mapView.invalidateSize();
        });
    }

    initLayout()
    {
        this.setLayout(new SplitLayout({
            direction: SplitLayout.HORIZONTAL,
            ratio: [ 300, undefined ]
        }));
    }
}
