import View from "sap/a/view/View";

import CitySearchView from "../view/CitySearchView";
import OsmServiceClient from "../service/OsmServiceClient";

export default class CityEidtor extends View
{
    metadata = {
        properties: {
            bounds: { type: "object", bindable: true },
            centerLocation: { type: "object", bindable: true },
            code: { type: "string", bindable: true },
            name: { type: "string", bindable: true },
            osmId: { typr: "string", bindable: true }
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
                </div>
                <div class="item code">
                    <label>
                        <i class="icon ion-pound" />
                    </label>
                    <input type="text" placeholder="Input code" />
                </div>
            </header>
        `);
        this.citySearchView = new CitySearchView();
        this.addSubview(this.citySearchView, this.$header.find(".name"));
        
        this.$element.append(this.$header);
        
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

    setCity(value)
    {
        this.setName(value.displayName);
        this.setCode(value.code || "");
        this.setBounds(value.bounds);
        this.setCenterLocation(value.centerLocation);
        this.setOsmId(value.osmId);
    }

    setName(name)
    {
        this.setProperty("name", name);
        if (this.$header)
        {
            this.citySearchView.setName(name);
        }
    }
    
    setCode(code)
    {
        console.log("set code", code);
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
}
