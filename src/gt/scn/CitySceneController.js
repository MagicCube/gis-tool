import Scene from "./Scene";
import SceneController from "./SceneController";

export default class CitySceneController extends SceneController
{
    createView()
    {
        const scene = new Scene({
            id: "cityScene",
            title: "CITY"
        });
        scene.$container.text("CITY");
        return scene;
    }
}
