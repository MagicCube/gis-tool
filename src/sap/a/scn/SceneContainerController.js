import ViewController from "sap/a/view/ViewController";
import SceneController from "sap/a/scn/SceneController";

import SceneContainer from "./SceneContainer";

export default class SceneContainerController extends ViewController
{
    createView(options)
    {
        return new SceneContainer(options);
    }

    setSceneController(controller)
    {
        const oldController = this._getSceneController();
        if (oldController)
        {
            this.removeAggregation("childViewControllers", oldController);
        }

        if (controller instanceof SceneController)
        {
            this.addAggregation("childViewControllers", controller);
            this.view.setScene(controller.view);
        }
        else if (controller === null)
        {
            this.view.setScene(null);
        }
        else
        {
            throw new Error("#setSceneController(controller): controller must be a SceneController");
        }
    }

    _getSceneController()
    {
        const childViewControllers = this.getChildViewControllers();
        return childViewControllers.find(item => item instanceof SceneController);
    }
}
