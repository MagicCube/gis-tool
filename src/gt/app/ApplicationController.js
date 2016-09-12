import BaseApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import SceneTabContainerController from "../scn/SceneTabContainerController";

import CitySceneController from "../scn/CitySceneController";
import CorridorSceneController from "../scn/CorridorSceneController";
import KeyRouteSceneController from "../scn/KeyRouteSceneController";
import WaySceneController from "../scn/WaySceneController";

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
        this.waySceneController = new WaySceneController("waySceneController");
        
        this.sceneTabContainerController.setSceneControllers([
            this.citySceneController,
            this.corridorSceneController,
            this.keyRouteSceneController,
            this.waySceneController
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
        this.sceneTabContainerController.selectSceneController("citySceneController");
    }
}
