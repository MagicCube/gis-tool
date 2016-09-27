import StateBus from "sap/a/state/StateBus";

import RouteListView from "../view/RouteListView";
import Scene from "./Scene";
import SceneController from "./SceneController";
import WayEditor from "../view/WayEditor";

export default class WaySceneController extends SceneController
{
    createView()
    {
        const scene = new Scene({
            id: "wayScene",
            title: "WAYS"
        });

        this.mapView = scene.mapView;

        this.listView = new RouteListView({
            items: "{project>/ways}",
            selectionChange: this._listView_selectionChange.bind(this),
            itemDelete: this._listView_itemDelete.bind(this)
        });
        scene.addSubview(this.listView, scene.$(">aside"));

        const fab = scene.fab;
        fab.attachClick(this._fab_click.bind(this));

        this.routeEditor = new WayEditor({
            create: this._routeEditor_create.bind(this),
            cancel: this._routeEditor_cancel.bind(this)
        });
        this.routeEditor.hide();
        scene.addSubview(this.routeEditor, scene.$element);

        return scene;
    }

    selectRoute(index)
    {
        this.clearSelection(false);

        const path = "project>/ways/" + index;
        this.routeEditor.bindName(`${path}/name`);
        this.routeEditor.bindCategory(`${path}/category`);
        this.routeEditor.bindDirection(`${path}/direction`);
        this.routeEditor.bindKeyLocations(`${path}/keyLocations`);
        this.routeEditor.show();

        const routeLayer = this.mapView.wayLayer;
        routeLayer.bindDirection(`${path}/direction`);
        routeLayer.bindKeyLocations(`${path}/keyLocations`);
    }

    clearSelection(clearListViewSelection = true)
    {
        StateBus.getInstance().setState("/selectedWay", null);
        this.routeEditor.unbindName(false);
        this.routeEditor.unbindDirection(false);
        this.routeEditor.unbindKeyLocations(false);

        const routeLayer = this.mapView.wayLayer;
        routeLayer.unbindDirection();
        routeLayer.unbindKeyLocations();

        if (clearListViewSelection)
        {
            this.listView.setSelection(null);
        }
    }

    _listView_selectionChange(e)
    {
        const item = this.listView.getSelection();
        const route = item.getRoute();
        StateBus.getInstance().setState("selectedWay", route);

        const index = this.listView.getItems(item).indexOf(item);
        this.routeEditor.show();
        this.selectRoute(index);
    }

    _listView_itemDelete(e)
    {
        const item = e.getParameter("item");
        const route = item.getRoute();
        if (!confirm(`Do you want to delete ${route.name}?`))
        {
            return;
        }
        if (route)
        {
            this.clearSelection();
            this.routeEditor.hide();

            const projectModel = sap.ui.getCore().getModel("project");
            projectModel.removeItem("/ways", route);
            this.listView.removeItem(item);
        }
    }

    _fab_click()
    {
        this.getView().showOverlay();
        this.clearSelection();

        const dialogWidth = this.routeEditor.$element.width();
        const dialogHeight = this.routeEditor.$element.height();
        const sceneWidth = this.getView().$element.width();
        const sceneHeight = this.getView().$element.height();

        const centerTop = (window.parseInt(sceneHeight) - window.parseInt(dialogHeight)) / 2 - 50;
        const centerRight = (window.parseInt(sceneWidth) - window.parseInt(dialogWidth)) / 2;
        if (this.routeEditor.isShown())
        {
            this.routeEditor.setMode("create");
            this.routeEditor.$element.transition({
                top: centerTop,
                right: centerRight
            }, 400);
        }
        else
        {
            this.routeEditor.setMode("create", 0);
            this.routeEditor.$element.css({
                top: centerTop,
                right: centerRight,
                scale: 0,
                opacity: 0
            });
            this.routeEditor.show();
            this.routeEditor.$element.transition({
                scale: 1,
                opacity: 1
            }, 400);
        }
    }

    _routeEditor_create()
    {
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

        this.getView().hideOverlay();
        const route = {
            name,
            "category": 1,
            "direction": 0,
            "keyLocations": [ {}, {} ]
        };
        const projectModel = sap.ui.getCore().getModel("project");
        projectModel.appendItem("/ways", route);
        this.listView.unbindItems(false);
        this.listView.bindItems("project>/ways");
        this.routeEditor.setMode("edit");
        this.routeEditor.$element.css({
            top: 20,
            right: 20
        });
        const routeIndex = projectModel.getProperty("/ways").length - 1;
        this.selectRoute(routeIndex);
        this.listView.setSelection(this.listView.getItems()[routeIndex]);
    }

    _routeEditor_cancel()
    {
        this.getView().hideOverlay();
        this.routeEditor.setMode("edit");
        this.routeEditor.$element.transition({
            scale: 0,
            opacity: 0
        }, 400);
        setTimeout(() => {
            this.routeEditor.hide();
            const top = 20;
            const right = 20;
            this.routeEditor.$element.css({
                scale: 1,
                opacity: 1,
                top,
                right
            });
        }, 400);
    }
}
