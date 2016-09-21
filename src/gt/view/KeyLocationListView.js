import View from "sap/a/view/View";

const ORIGIN_MARKER_URL = "../vendor/leaflet/images/marker-origin.png";
const DESTINATION_MARKER_URL = "../vendor/leaflet/images/marker-destination.png";

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
        let iconUrl;
        let placeholder;
        if (index === 0)
        {
            iconUrl = ORIGIN_MARKER_URL;
            placeholder = "From";
        }
        else if (index === this.getItems().length - 1)
        {
            iconUrl = DESTINATION_MARKER_URL;
            placeholder = "To";
        }
        else
        {
            iconUrl = ORIGIN_MARKER_URL;
            placeholder = "Passby";
        }

        const draggable = (index === 0 || index === this.getItems().length - 1) ? "true" : "false";
        const $keyLocation = $(`
            <div class="item">
                <label draggable=${draggable}><img src=${iconUrl} /></label>
                <input type="text" disabled="true" value="${this._formatItem(item, placeholder)}" />
            </div>
        `);

        if (draggable)
        {
            $keyLocation.find("label").on("dragstart", e => {
                e = e.originalEvent;
                const img = new Image();
                if (index === 0)
                {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("origin", "true");
                    img.src = ORIGIN_MARKER_URL;
                }
                else
                {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("destination", "true");
                    img.src = DESTINATION_MARKER_URL;
                }
                e.dataTransfer.setDragImage(img, 12.5, 41);
            });
        }

        this.$container.append($keyLocation);
    }

    _formatItem(item, placeholder)
    {
        if (item && item.lat)
        {
            return item ? (item.lat.toFixed(4) + ", " + item.lng.toFixed(4)) : placeholder
        }
        else
        {
            return placeholder;
        }
    }
}
