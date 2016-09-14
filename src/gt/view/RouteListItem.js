import ListItem from "sap/a/view/ListItem";

export default class RouteListItem extends ListItem
{
    metadata = {
        properties: {
            direction: { type: "string", bindable: true },
        },
    };

    initLayout()
    {
        this.$directionIcon = $(`<i class="direction-icon icon ion-arrow-up-c"></i>`);
        this.$container.append(this.$directionIcon);
        super.initLayout();
        this.$deleteIcon = $(`<i class="delete-icon icon ion-android-cancel"></i>`);
        this.$deleteIcon.on("click", () => {
            this.getParent().removeItem(this);
        });
        this.$container.append(this.$deleteIcon);
    }
    
    setDirection(value)
    {
        this.setProperty("direction", value);
        if (typeof value === "number")
        {
            this.$directionIcon.css("transform", `rotate(${value}deg)`);
            console.log("transform", `rotate(${value}deg)`);
        }
    }
}
