import SceneContainerController from "sap/a/scn/SceneContainerController";

import SceneTabContainer from "./SceneTabContainer";

export default class SceneTabContainerController extends SceneContainerController
{
    createView(options)
    {
        return new SceneTabContainer(options);
    }

    setSceneControllers(controllers)
    {
        this.sceneControllers = controllers;
        this.sceneControllers.forEach(controller => {
            this.sceneControllers[controller.getId()] = controller;
            this.view.appendScene(controller.view);
        });
    }
}
