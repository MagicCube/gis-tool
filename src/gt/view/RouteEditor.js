import View from "sap/a/view/View";

import KeyLocationListView from "./KeyLocationListView";

export default class RouteEidtor extends View
{
    metadata = {
        properties: {
            name: { type: "string", bindable: true },
            direction: { type: "float", bindable: true },
            keyLocations: { type: "object", bindable: true },
            mode: { type: "string", defaultValue: "edit" }
        },
        events: {
            create: {},
            cancel: {}
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
        const $main = $(`<main />`);
        this.$element.append($main);
        this.keyLocationListView = new KeyLocationListView({
            items: this.getKeyLocations()
        });
        this.addSubview(this.keyLocationListView, $main);
    }

    _initFooter()
    {
        const $footer = $(`
            <footer>
                <a class="create-button">Create</a>
                <a class="cancel-button">Cancel</a>
            </footer>
        `);
        this.$element.append($footer);
        $footer.children(".create-button").on("click", e => {
            // e.preventDefault();
            this.fireCreate();
        });
        $footer.children(".cancel-button").on("click", e => {
            // e.preventDefault();
            this.fireCancel();
        });
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

    setMode(mode)
    {
        this.setProperty("mode", mode);
        if (mode === "create")
        {
            this.$("header > .item:not(:first-child)").slideUp(400);
            this.$("main").slideUp(400);
            this.$("footer").slideDown(400);
        }
        else
        {
            this.$("header > .item:not(:first-child)").slideDown(400);
            this.$("main").slideDown(400);
            this.$("footer").slideUp(400);
            this.$(".name > input").val("");
        }
    }
}
