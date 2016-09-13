import Scene from "./Scene";
import SceneController from "./SceneController";

export default class KeyRouteSceneController extends SceneController
{
    createView()
    {
        const scene = new Scene({
            id: "keyRouteScene",
            title: "KEYROUTES"
        });
        return scene;
    }
}
