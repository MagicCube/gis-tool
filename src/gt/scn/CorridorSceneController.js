import StateBus from "sap/a/state/StateBus";

import CorridorEditor from "../view/CorridorEditor";
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
                const route = e.getParameter("item").getRoute();
                StateBus.getInstance().setState("selectedCorridor", route);
            },
            itemDelete: e => {
                const item = e.getParameter("item");
                const route = item.getRoute();
                if (!confirm(`Are you sure you want to delete corridor ${route.name}?`))
                {
                    return;
                }
                if (route)
                {
                    const selectedRoute = StateBus.getInstance().getState("/selectedCorridor");
                    if (selectedRoute && route.id === selectedRoute.id)
                    {
                        StateBus.getInstance().setState("/selectedCorridor", null);
                    }
                    
                    const projectModel = sap.ui.getCore().getModel("project");
                    projectModel.removeItem("corridors", route);
                    
                    this.listView.removeItem(item);
                }
            }
        });
        scene.addSubview(this.listView, scene.$(">.sub-container:nth-child(1)"));

        return scene;
    }

    _initCorridorEditor()
    {
        const corridorEditor = new CorridorEditor({
            selectedCorridor: "{state>/selectedCorridor}"
        });
        this.getView().addSubview(corridorEditor, this.getView().$(">.sub-container:nth-child(2)"));
    }
}
