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
        const keyLocationListView = new KeyLocationListView({
            items: "{state>/selectedCorridor/keyLocations}"
        });

        this.addSubview(keyLocationListView, this.$main);
    }





    setRoute(route)
    {
        this.setProperty("route", route);
        this.$element.toggle(route !== undefined && route !== null);
    }

    setName(value)
    {
        this.setProperty("name", value);
        this.$header.find(".name > input").val(value);
    }

    setDirection(value)
    {
        this.setProperty("direction", value);
        this.$header.find(".direction > input").val(value);
    }
}
