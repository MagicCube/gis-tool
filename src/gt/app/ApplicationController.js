import BaseApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import SceneTabContainerController from "../scn/SceneTabContainerController";

export default class ApplicationController extends BaseApplicationController
{
    afterInit()
    {
        super.afterInit();
        this.initSceneTabContainerController();
    }

    initSceneTabContainerController()
    {
        this.sceneTabContainerController = new SceneTabContainerController();
        this.addChildViewController(this.sceneTabContainerController);
    }

    createView()
    {
        const app = new Application();
        app.addStyleClass("gt-app");
        return app;
    }

    run()
    {
        super.run();
        console.log("App is running......");
    }
}
