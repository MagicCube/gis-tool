import View from "sap/a/view/View";

import OsmServiceClient from "../service/OsmServiceClient";

export default class CityEidtor extends View
{
    metadata = {
        properties: {
            name: { type: "string", bindable: true },
            code: { type: "string", bindable: true },
            bounds: { typr: "object", bindable: true }
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
                    <input type="text" placeholder="Input name" list="suggestion" />
                    <datalist id="suggestion">
                        
                    </datalist>
                </div>
                <div class="item code">
                    <label>
                        <i class="icon ion-pound" />
                    </label>
                    <input type="text" placeholder="Input code" />
                </div>
            </header>
        `);
        this.$element.append(this.$header);
        
        this.$header.find(".name > input").on("change", e => {
            this.setName($(e.currentTarget).val());
        });
        
        this.$header.find(".name > input").on("input", e => {
            window.clearTimeout(this.inputTimer);
            this.inputTimer = window.setTimeout(() => {
                this._onInputChange(e);
            }, 300);
        });
        
        this.$header.find(".code > input").on("change", e => {
            this.setCode($(e.currentTarget).val());
        });
    }

    _initMain()
    {
        this.$main = $(`
            <main>
                <div class="item">
                    <label>
                        <i class="icon ion-arrow-up-c" />
                    </label>
                    <input type="text" disabled="true" placeholder="Select north bound" />
                </div>
                <div class="item">
                    <label>
                        <i class="icon ion-arrow-down-c" />
                    </label>
                    <input type="text" disabled="true" placeholder="Select south bound" />
                </div>
                <div class="item">
                    <label>
                        <i class="icon ion-arrow-left-c" />
                    </label>
                    <input type="text" disabled="true" placeholder="Select west bound" />
                </div>
                <div class="item">
                    <label>
                        <i class="icon ion-arrow-right-c" />
                    </label>
                    <input type="text" disabled="true" placeholder="Select east bound" />
                </div>
            </main>
        `);
        this.$element.append(this.$main);
    }

    setName(name)
    {
        console.log("set name");
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
    
    setBounds(bounds)
    {
        this.setProperty("bounds", bounds);
        if (bounds && bounds[0] && bounds[1])
        {
            const { lat: south, lng: west } = bounds[0];
            const { lat: north, lng: east } = bounds[1];
            const data = [north, south, west, east];
            this.$main.find(".item > input").val(i => data[i].toFixed(4));
        }
    }
    
    _onInputChange(e)
    {
        const input = $(e.currentTarget).val();
        if (input)
        {
            console.log("input change");
            OsmServiceClient.getInstance().searchCity(input).then(cities => {
                const $datalist = this.$header.find("#suggestion");
                $datalist.children().remove();
                cities.forEach(city => {
                    const $option = $("<option/>");
                    $option.attr("value", city.displayName);
                    $option.data("city", city);
                    $datalist.append($option);
                });
            });
        }
    }
}
