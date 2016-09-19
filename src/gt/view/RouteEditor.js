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
        }
    };


    init()
    {
        super.init();
        this.addStyleClass("gt-route-editor");
        this._initLayout();
    }

    _initLayout()
    {
        this._initHeader();
        this._initMain();
        this._initFooter();
    }

    _initHeader()
    {
        this.$header = $(`
            <header>
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
            </header>
        `);
        this.$element.append(this.$header);
        this.$header.find(".name > input").on("change", (e) => {
            this.setName($(e.currentTarget).val());
        });
        this.$header.find(".direction > input").on("change", (e) => {
            this.setDirection(parseFloat($(e.currentTarget).val()));
        });
    }

    _initMain()
    {
        this.$main = $(`<main />`);
        this.$element.append(this.$main);
        this.keyLocationListView = new KeyLocationListView({
            items: this.getKeyLocations()
        });
        this.addSubview(this.keyLocationListView, this.$main);
    }

    _initFooter()
    {
        this.$footer = $(`
            <footer>
                <a class="create-button">Create</a>
                <a class="cancel-button">Cancel</a>
            </footer>
        `);
        this.$element.append(this.$footer);
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
