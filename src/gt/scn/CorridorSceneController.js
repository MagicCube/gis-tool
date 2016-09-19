import StateBus from "sap/a/state/StateBus";

import RouteEditor from "../view/RouteEditor";
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

        this.mapView = scene.mapView;

        this.listView = new RouteListView({
            items: "{project>/corridors}",
            itemClick: this._listView_itemClick.bind(this),
            itemDelete: this._listView_itemdDelete.bind(this)
        });
        scene.addSubview(this.listView, scene.$(">aside"));

        this.routeEditor = new RouteEditor();
        scene.addSubview(this.routeEditor, scene.$element);

        return scene;
    }

    selectRoute(index)
    {
        this.clearSelection();

        const path = "project>/corridors/" + index;
        this.routeEditor.bindRoute(path);
        this.routeEditor.bindName(`${path}/name`);
        this.routeEditor.bindDirection(`${path}/direction`);

        const routeLayer = this.mapView.routeLayer;
        routeLayer.bindKeyLocations(`${path}/keyLocations`);
        /*
         要删除
            routeLayer.bindKeyLocations(`${path}/keyLocations`);
            routeLayer.bindKeyLocations({
                model: "project",
                path: "corridors/xxx/keyLocations",
                mode: sap.ui.model.BindingMode.TwoWay
            });
        */
    }

    clearSelection()
    {
        StateBus.getInstance().setState("/selectedCorridor", null);
        this.routeEditor.unbindRoute(false);
        this.routeEditor.unbindName(false);
        this.routeEditor.unbindDirection(false);
        this.routeEditor.unbindKeyLocations(false);
        this.routeEditor.setRoute(null);

        const routeLayer = this.mapView.routeLayer;
        routeLayer.unbindKeyLocations();
    }

    _listView_itemClick(e)
    {
        const item = e.getParameter("item");
        const route = item.getRoute();
        StateBus.getInstance().setState("selectedCorridor", route);

        const index = this.listView.getItems(item).indexOf(item);
        this.selectRoute(index);
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
            const selectedRoute = StateBus.getInstance().getState("/selectedCorridor");
            if (selectedRoute && route.id === selectedRoute.id)
            {
                this.clearSelection();
            }

            const projectModel = sap.ui.getCore().getModel("project");
            projectModel.removeItem("/corridors", route);

            this.listView.removeItem(item);
        }
    }
}
