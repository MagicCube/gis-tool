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
        scene.$element.children("aside").remove();
        scene.$element.children("main").css({
            left: 0
        });
        
        this.mapView = scene.mapView;
        this.mapView.boundLayer.bindCityBounds("project>/city/bounds");
        
        return scene;
    }
}
