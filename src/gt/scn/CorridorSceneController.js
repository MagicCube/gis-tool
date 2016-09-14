import StateBus from "sap/a/state/StateBus";

import RouteListView from "../view/RouteListView";
import Scene from "./Scene";
import SceneController from "./SceneController";

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
            items: "{project>/corridors}",
            itemClick: e => {
                const corridor = e.getParameter("item").getRoute();
                StateBus.getInstance().setState("selectedCorridor", corridor);
            },
            itemDelete: e => {
                // 判断是否为选项，如果是则先清空选项
            }
        });
        scene.addSubview(this.listView, scene.$(">.sub-container:nth-child(1)"));

        return scene;
    }

    _initCorridorEditor()
    {
        // TODO
    }
}
