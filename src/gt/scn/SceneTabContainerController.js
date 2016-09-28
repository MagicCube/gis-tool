import SceneContainerController from "sap/a/scn/SceneContainerController";

import SceneTabContainer from "./SceneTabContainer";

export default class SceneTabContainerController extends SceneContainerController
{
    createView(options)
    {
        const view = new SceneTabContainer(options);
        view.bindProjectId("state>/projectId");
        return view;
    }

    setSceneControllers(controllers)
    {
        this.sceneControllers = controllers;
        this.sceneControllers.forEach(controller => {
            this.sceneControllers[controller.getId()] = controller;
            this.view.appendScene(controller.view);
        });
    }

    selectSceneController(id)
    {
        this.view.selectScene(this.sceneControllers[id].view.getId());
    }
}
