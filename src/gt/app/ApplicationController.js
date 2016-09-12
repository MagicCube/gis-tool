import BaseApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import SceneTabContainerController from "../scn/SceneTabContainerController";

import CitySceneController from "../scn/CitySceneController";
import CorridorSceneController from "../scn/CorridorSceneController";
import KeyRouteSceneController from "../scn/KeyRouteSceneController";

export default class ApplicationController extends BaseApplicationController
{
    afterInit()
    {
        super.afterInit();
        this._initSceneTabContainerController();
        this._initSceneControllers();
    }

    _initSceneTabContainerController()
    {
        this.sceneTabContainerController = new SceneTabContainerController();
        this.addChildViewController(this.sceneTabContainerController);
    }

    _initSceneControllers()
    {
        this.citySceneController = new CitySceneController("citySceneController");
        this.corridorSceneController = new CorridorSceneController("corridorSceneController");
        this.keyRouteSceneController = new KeyRouteSceneController("keyRouteSceneController");

        this.sceneTabContainerController.setSceneControllers([
            this.citySceneController,
            this.corridorSceneController,
            this.keyRouteSceneController
        ]);
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
