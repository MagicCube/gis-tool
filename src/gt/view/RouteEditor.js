import View from "sap/a/view/View";

import KeyLocationListView from "./KeyLocationListView";

export default class RouteEditor extends View
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
        this.addStyleClass("gt-gis-editor gt-route-editor");
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
                    <input type="range" min="0" max="360" step="5" />
                </div>
            </header>
        `);
        this.$element.append(this.$header);
        this.$header.find(".name > input").on("change", e => {
            this.setName($(e.currentTarget).val());
        });
        this.$header.find(".direction > input").on("input", e => {
            const direction = window.parseInt(this.$header.find(".direction > input").val());
            const delta = Math.abs(direction - (this.getDirection() || 0));
            this.setDirection(direction, delta > 20);
        });
        this.$directionIcon = this.$header.find(".direction > label");
        this.$progressBar = this.$header.find(".direction > input");
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
            this.fireCreate();
        });
        $footer.children(".cancel-button").on("click", e => {
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

    setDirection(direction = 0, transition = true)
    {
        this.setProperty("direction", direction);
        if (this.$header)
        {
            const degree = window.parseInt(direction) - 45;
            if (transition)
            {
                this.$directionIcon.transition({
                    transform: `rotate(${degree}deg)`
                }, 200);
            }
            else
            {
                this.$directionIcon.css({
                    transform: `rotate(${degree}deg)`
                });
            }
            this.$progressBar.val(direction || 0);
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

    setMode(mode, duration)
    {
        this.setProperty("mode", mode);
        if (mode === "create")
        {
            this.$("header > .item:not(:first-child)").slideUp(duration);
            this.$("main").slideUp(duration);
            this.$("footer").slideDown(duration);
        }
        else
        {
            this.$("header > .item:not(:first-child)").slideDown(duration);
            this.$("main").slideDown(duration);
            this.$("footer").slideUp(duration);
            this.$(".name > input").val("");
        }
    }

    show()
    {
        super.show();
        this._isShown = true;
    }

    hide()
    {
        super.hide();
        this._isShown = false;
    }

    isShown()
    {
        return this._isShown;
    }
}
