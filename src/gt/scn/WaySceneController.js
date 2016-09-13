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
        scene.$(".sub-container:nth-child(1)").text("WAYS");
        return scene;
    }
}
