import SplitLayout from "sap/a/layout/SplitLayout";
import SuperApplication from "sap/a/app/Application";

import AppBar from "../view/AppBar";
import SceneTabContainer from "../scn/SceneTabContainer";

export default class Application extends SuperApplication
{
    init()
    {
        super.init();
        this._initAppBar();
        this._initSceneTabContainer();
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

    _initSceneTabContainer()
    {
        this.sceneTabContainer = new SceneTabContainer({

        });
        this.addSubview(this.sceneTabContainer);
    }
}
