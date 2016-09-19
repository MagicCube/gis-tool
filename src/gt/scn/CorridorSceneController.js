import StateBus from "sap/a/state/StateBus";

import RouteEditor from "../view/RouteEditor";
import RouteListView from "../view/RouteListView";
import RouteListItem from "../view/RouteListItem";
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
        const fab = scene.fab;
        fab.attachClick(() => {
            this.clearSelection();

            const dialogWidth = this.routeEditor.$element.width();
            const dialogHeight = this.routeEditor.$element.height();

            const sceneWidth = scene.$element.width();
            const sceneHeight = scene.$element.height();

            this.routeEditor.show();
            this.routeEditor.$element.transition({
                top: (window.parseInt(sceneHeight) - window.parseInt(dialogHeight)) / 2 - 50,
                right: (window.parseInt(sceneWidth) - window.parseInt(dialogWidth)) / 2
            }, 400);

            this.routeEditor.setMode("create");
        });

        this.mapView = scene.mapView;

        this.listView = new RouteListView({
            items: "{project>/corridors}",
            itemClick: this._listView_itemClick.bind(this),
            itemDelete: this._listView_itemdDelete.bind(this)
        });
        scene.addSubview(this.listView, scene.$(">aside"));

        this.routeEditor = new RouteEditor();
        this.routeEditor.hide();
        scene.addSubview(this.routeEditor, scene.$element);
        this.routeEditor.attachCreate(() => {
            let name = this.routeEditor.getName();
            if (!name)
            {
                return;
            }
            name = name.trim();
            if (name === "")
            {
                return;
            }

            const route = {
                name,
                "direction": 0,
                "keyLocations": [ null, null ]
            };
            const projectModel = sap.ui.getCore().getModel("project");
            projectModel.appendItem("/corridors", route);
            this.listView.unbindItems(false);
            this.listView.bindItems("project>/corridors");
            this.routeEditor.setMode("edit");
            this.routeEditor.$element.css({
                top: 20,
                right: 20
            });
            this.selectRoute(projectModel.getProperty("/corridors").length - 1);
        });
        this.routeEditor.attachCancel(() => {
            this.routeEditor.setMode("edit");
            this.routeEditor.$element.css({
                top: 20,
                right: 20
            });
            this.routeEditor.hide();
        });

        return scene;
    }

    selectRoute(index)
    {
        this.clearSelection();

        const path = "project>/corridors/" + index;
        this.routeEditor.bindName(`${path}/name`);
        this.routeEditor.bindDirection(`${path}/direction`);
        this.routeEditor.bindKeyLocations(`${path}/keyLocations`);

        const bindKeyLocations = this.mapView.corridorLayer;
        bindKeyLocations.bindKeyLocations(`${path}/keyLocations`);
    }

    clearSelection()
    {
        StateBus.getInstance().setState("/selectedCorridor", null);
        this.routeEditor.unbindName(false);
        this.routeEditor.unbindDirection(false);
        this.routeEditor.unbindKeyLocations(false);

        const corridorLayer = this.mapView.corridorLayer;
        corridorLayer.unbindKeyLocations();
    }

    _listView_itemClick(e)
    {
        const item = e.getParameter("item");
        const route = item.getRoute();
        StateBus.getInstance().setState("selectedCorridor", route);

        const index = this.listView.getItems(item).indexOf(item);
        this.routeEditor.show();
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
