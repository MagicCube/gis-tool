import Scene from "./Scene";
import SceneController from "./SceneController";

import RouteListView from "../view/RouteListView";

export default class CorridorSceneController extends SceneController
{
    afterInit()
    {
        super.afterInit();
        this._initCorridorEditor();
    }

    createView()
    {
        const scene = new Scene({
            id: "corridorScene",
            title: "CORRIDOR"
        });

        this.listView = new RouteListView({
            items: "{project>/corridors}"
        });
        scene.addSubview(this.listView, scene.$(">.sub-container:nth-child(1)"));

        return scene;
    }

    _initCorridorEditor()
    {
        // TODO
    }
}
