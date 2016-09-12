import View from "sap/a/view/View";
import Scene from "./Scene";

export default class SceneContainer extends View
{
    metadata = {
        properties: {
            scene: { type: "object" }
        }
    };

    setScene(scene, $container)
    {
        this.clearScene();

        if (scene)
        {
            if (scene instanceof Scene)
            {
                this.setProperty("scene", scene);
                this.addSubview(scene, $container);
                scene.activate();
                scene.invalidateSize();
            }
            else
            {
                throw new Error("#setScene(scene): scene must be a Scene object.");
            }
        }
    }

    clearScene()
    {
        const oldScene = this.getScene();
        if (oldScene)
        {
            oldScene.deactivate();
            this.removeSubview(oldScene);
        }
    }
}
