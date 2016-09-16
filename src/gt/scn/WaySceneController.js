import StateBus from "sap/a/state/StateBus";

import WayEditor from "../view/CorridorEditor";
import RouteListView from "../view/RouteListView";
import Scene from "./Scene";
import SceneController from "./SceneController";

export default class WaySceneController extends SceneController
{    
    afterInit()
    {
        super.afterInit();
        this._initRouteEditor();
    }

    createView()
    {
        const scene = new Scene({
            id: "wayScene",
            title: "WAYS"
        });

        this.listView = new RouteListView({
            items: "{project>/ways}",
            itemClick: this._listView_itemClick.bind(this),
            itemDelete: this._listView_itemdDelete.bind(this)
        });
        scene.addSubview(this.listView, scene.$(">aside"));

        return scene;
    }

    _initRouteEditor()
    {
        const wayEditor = new WayEditor({
            selectedWay: "{state>/selectedWay}"
        });
        this.getView().addSubview(wayEditor, this.getView().$element);
    }
    
    _listView_itemClick(e)
    {
        const route = e.getParameter("item").getRoute();
        StateBus.getInstance().setState("/selectedWay", route);
    }
    
    _listView_itemdDelete(e)
    {
        const item = e.getParameter("item");
        const route = item.getRoute();
        if (!confirm(`Are you sure you want to delete ${route.name}?`))
        {
            return;
        }
        if (route)
        {
            const selectedRoute = StateBus.getInstance().getState("/selectedWay");
            if (selectedRoute && route.id === selectedRoute.id)
            {
                StateBus.getInstance().setState("/selectedWay", null);
            }

            const projectModel = sap.ui.getCore().getModel("project");
            projectModel.removeItem("ways", route);

            this.listView.removeItem(item);
        }
    }
}
