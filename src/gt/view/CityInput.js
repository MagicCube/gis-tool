import View from "sap/a/view/View";

import OsmServiceClient from "../service/OsmServiceClient";

export default class CityInput extends View
{
    metadata = {
        properties: {
            city: { type: "object" }
        },
        events: {
            change: { }
        }
    };
    
    init()
    {
        super.init();
        this.addStyleClass("gt-city-input");
        this._initLayout();
    }

    _initLayout()
    {
        this.$input = $(`<input type="search" autocomplete="off" placeholder="Input name"/>`);
        this.$element.append(this.$input);
        this.$list = $("<ul/>");
        this.$element.append(this.$list);
        this._hideList();
        
        this.$input.on("blur", this._hideList.bind(this));
        
        this.$input.on("change", e => {
            this.getCity().displayName = this.$input.val();
            this._hideList();
            this.fireChange();
        });
        
        this.$input.on("input", e => {
            window.clearTimeout(this.inputTimer);
            this.inputTimer = window.setTimeout(() => {
                this._onInputChange(e);
            }, 300);
        });
        
        this.$list.on("mousedown", "li", e => {
            const city = $(e.currentTarget).data("city");
            this.setCity(city);
            this.fireChange();
            this._hideList();
            e.preventDefault();
        });
    }
    
    setCity(value)
    {
        this.setProperty("city", value);
        this.$input.val(value.displayName);
    }
    
    _hideList()
    {
        this.$list.hide();
    }
    
    _showList()
    {
        this.$list.show();
    }
    
    _onInputChange(e)
    {
        const input = this.$input.val();
        if (input)
        {
            OsmServiceClient.getInstance().searchCity(input).then(cities => {
                this.$list.children().remove();
                cities.forEach(city => {
                    const $item = $(`<li>${city.displayName}</li>`);
                    $item.data("city", city);
                    this.$list.append($item);
                });
                if (cities.length > 0)
                {
                    this._showList();
                    return;
                }
            });
        }
        this._hideList();
    }
}
