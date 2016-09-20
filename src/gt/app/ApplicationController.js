import BaseApplicationController from "sap/a/app/ApplicationController";
import StateBus from "sap/a/state/StateBus";

import Application from "./Application";
import ProjectModel from "../model/ProjectModel";
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
        this._initStateBus();
        this._initModels();
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
    
    _initStateBus()
    {
        new StateBus();
        const stateModel = sap.ui.getCore().getModel("state");
        this.setModel(stateModel, "state");
    }
    
    _initModels()
    {
        const projectModel = new ProjectModel();
        sap.ui.getCore().setModel(projectModel, "project");
        this.setModel(projectModel, "project");
    }

    createView()
    {
        const app = new Application();
        app.addStyleClass("gt-app");
        return app;
    }

    async run()
    {
        super.run();
        const projectMoel = this.getModel("project");
        await projectMoel.loadProject();
        this.sceneTabContainerController.selectSceneController("citySceneController");

        const city = projectMoel.getProperty("/city");
        if (city && city.centerLocation)
        {
            this.view.mapView.setCenterLocation(city.centerLocation);
        }
        
    }
}
