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

    _listView_itemClick(e)
    {
        const item = e.getParameter("item");
        const route = item.getRoute();
        StateBus.getInstance().setState("selectedCorridor", route);

        const index = this.listView.getItems(item).indexOf(item);
        const path = "project>/corridors/" + index;
        this.routeEditor.unbindRoute(false);
        this.routeEditor.bindRoute(path);
        this.routeEditor.unbindName(false);
        this.routeEditor.bindName(`${path}/name`);
        this.routeEditor.unbindDirection(false);
        this.routeEditor.bindDirection(`${path}/direction`);

        const mapView = this.view.mapView;
        const routeLayer = mapView.routeLayer;
        routeLayer.unbindKeyLocations();
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
                StateBus.getInstance().setState("/selectedCorridor", null);
                this.routeEditor.unbindRoute(false);
                this.routeEditor.unbindName(false);
                this.routeEditor.unbindDirection(false);
                this.routeEditor.unbindKeyLocations(false);
                this.routeEditor.setRoute(null);
            }

            const projectModel = sap.ui.getCore().getModel("project");
            projectModel.removeItem("/corridors", route);

            this.listView.removeItem(item);
        }
    }
}
