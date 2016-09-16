import View from "sap/a/view/View";

import KeyLocationListView from "./KeyLocationListView";

export default class RouteEidtor extends View
{
    metadata = {
        properties: {
            route: { type: "object", bindable: true },
            name: { type: "string", bindable: true },
            direction: { type: "float", bindable: true },
            keyLocations: { type: "object", bindable: true }
        },
    };


    init()
    {
        super.init();
        this.addStyleClass("gt-route-editor");
        this._initLayout();
    }

    _initLayout()
    {
        this.$header = $(`<header />`);
        this.$main = $(`<main />`);
        this.initHeader();
        this.initMain();
        this.$container.append(this.$header);
        this.$container.append(this.$main);
    }

    initHeader()
    {
        this.$header.append(`
            <div class="item name">
                <label>
                    <i class="icon ion-pinpoint" />
                </label>
                <input type="text" placeholder="Input name" />
            </div>
            <div class="item direction">
                <label>
                    <i class="icon ion-navigate" />
                </label>
                <input type="text" />
            </div>
        `);
        this.$header.find(".name > input").on("change", (e) => {
            this.setName($(e.currentTarget).val());
        });
        this.$header.find(".direction > input").on("change", (e) => {
            this.setDirection(parseFloat($(e.currentTarget).val()));
        });
    }

    initMain()
    {
        this.keyLocationListView = new KeyLocationListView({
            items: this.getKeyLocations()
        });
        this.addSubview(this.keyLocationListView, this.$main);
    }

    setRoute(route)
    {
        this.setProperty("route", route);
        this.$element.toggle(route !== undefined && route !== null);
    }

    setName(name)
    {
        this.setProperty("name", name);
        if (this.$header)
        {
            this.$header.find(".name > input").val(name);
        }
    }

    setDirection(direction)
    {
        this.setProperty("direction", direction);
        if (this.$header)
        {
            this.$header.find(".direction > input").val(direction);
        }
    }

    setKeyLocations(keyLocations)
    {
        this.setProperty("keyLocations", keyLocations);
        if (this.keyLocationListView)
        {
            this.keyLocationListView.setItems(keyLocations);
        }
    }
}
