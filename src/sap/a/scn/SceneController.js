import ViewController from "sap/a/view/ViewController";

import Scene from "./Scene";

export default class SceneController extends ViewController
{
    createView(options)
    {
        return new Scene(options);
    }

    isActive()
    {
        return this.view.isActive();
    }

    activate()
    {
        this.view.activate();
    }

    deactivate()
    {
        this.view.deactivate();
    }
}
