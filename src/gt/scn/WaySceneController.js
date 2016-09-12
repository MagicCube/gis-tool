import Scene from "./Scene";
import SceneController from "./SceneController";

export default class WaySceneController extends SceneController
{
    createView()
    {
        const scene = new Scene({
            id: "wayScene",
            title: "WAYS"
        });
        scene.$container.text("WAYS");
        return scene;
    }
}
