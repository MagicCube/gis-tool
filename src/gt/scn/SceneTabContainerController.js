import SceneContainerController from "sap/a/scn/SceneContainerController";

import SceneTabContainer from "./SceneTabContainer";

export default class SceneTabContainerController extends SceneContainerController
{
    createView(options)
    {
        return new SceneTabContainer(options);
    }
}
