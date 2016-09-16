import View from "sap/a/view/View";

export default class KeylocationListView extends View
{
    metadata = {
        properties: {
            items: { type: "object", bindable: true } // array
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("gt-key-direction-list-view");
    }

    setItems(items)
    {
        items = items ? items : ["", ""];
        this.setProperty("items", items);
        if (items && Array.isArray(items))
        {
            this._clearItems();
            items.forEach((item, index) => this._addItem(item, index));
        }
    }

    _clearItems()
    {
        this.$(".item").remove();
    }

    _addItem(item, index)
    {
        let iconClass;
        if (index === this.getItems().length - 1)
        {
            iconClass = "ion-location";
        }
        else
        {
            iconClass = "ion-android-radio-button-on";
        }

        this.$container.append(`
            <div class="item">
                <label><i class="icon ${iconClass}"></i></label>
                <span class="text">${item.text}</span>
            </div>
        `);
    }
}
