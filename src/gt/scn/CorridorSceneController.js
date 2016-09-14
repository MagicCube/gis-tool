import StateBus from "sap/a/state/StateBus";

import RouteListView from "../view/RouteListView";
import Scene from "./Scene";
import SceneController from "./SceneController";

export default class CorridorSceneController extends SceneController
{
    createView()
    {
        const scene = new Scene({
            id: "corridorScene",
            title: "CORRIDOR"
        });
        
        this.listView = new RouteListView({
            items: "{project>/corridors}",
            itemClick: item => {
                StateBus.getInstance().setProperty("selectedCorridor", item);
            }
        });
        scene.addSubview(this.listView, scene.$(">.sub-container:nth-child(1)"));
        
        return scene;
    }
}
