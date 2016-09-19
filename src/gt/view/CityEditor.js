import View from "sap/a/view/View";

export default class CityEidtor extends View
{
    metadata = {
        properties: {
            name: { type: "string", bindable: true },
            code: { type: "string", bindable: true }
        }
    };


    init()
    {
        super.init();
        this.addStyleClass("gt-gis-editor");
        this._initLayout();
    }

    _initLayout()
    {
        this._initHeader();
        this._initMain();
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
                <div class="item code">
                    <label>
                        <i class="icon ion-navigate" />
                    </label>
                    <input type="text" placeholder="Input code" />
                </div>
            </header>
        `);
        this.$element.append(this.$header);
        this.$header.find(".name > input").on("change", (e) => {
            this.setName($(e.currentTarget).val());
        });
        this.$header.find(".code > input").on("change", (e) => {
            this.setCode(parseFloat($(e.currentTarget).val()));
        });
    }

    _initMain()
    {
        const $main = $(`<main />`);
        this.$element.append($main);
    }


    setName(name)
    {
        this.setProperty("name", name);
        if (this.$header)
        {
            this.$header.find(".name > input").val(name);
        }
    }

    setCode(code)
    {
        this.setProperty("code", code);
        if (this.$header)
        {
            this.$header.find(".code > input").val(code);
        }
    }
}
