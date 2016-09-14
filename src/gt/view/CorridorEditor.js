import RouteEditor from "./RouteEditor";

export default class CorridorEditor extends RouteEditor
{
    metadata = {
        properties: {
            selectedCorridor: { type: "object", bindable: true }
        }
    };

    initHeader()
    {
        super.initHeader();
        this.$header.append(`
            <div class="item name">
                <label>
                    <i class="icon ion-pin" />
                </label>
                <input type="text" placeholder="Select a starting point, or click on the map" />
            </div>
            <div class="item direction">
                <label>
                    <i class="icon ion-navigate" />
                </label>
                <input type="text" />
            </div>
        `);
    }

    initMain()
    {
        super.initMain();
    }

    setSelectedCorridor(value)
    {
        this.setProperty("selectedCorridor", value);
        if (this.$header && value)
        {
            this.$header.find(".name > input").val(value.name);
            this.$header.find(".direction > input").val(value.direction);
        }
    }
}
