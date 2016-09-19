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
        if (!items || (Array.isArray(items) && items.length === 0))
        {
            items = [ null ,  null ];
        }
        this.setProperty("items", items);
        this._clearItems();
        items.forEach((item, index) => this._addItem(item, index));
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
        const draggable = (index === 0 || index === this.getItems().length - 1) ? "true" : "false";
        const $keyLocation = $(`
            <div class="item">
                <label draggable=${draggable}><i class="icon ${iconClass}"></i></label>
                <input type="text" disabled="true" value="${_formatItem(item)}" />
            </div>
        `);

        this.$container.append($keyLocation);
    }
}


function _formatItem(item)
{
    return item ? (item.lat + ", " + item.lng) : "N/A"
}
