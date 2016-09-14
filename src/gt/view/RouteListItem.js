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
        this.$container.append(`<i class="direction-icon icon ion-arrow-up-c"></i>`);
        super.initLayout();
        const $deleteIcon = $(`<i class="delete-icon icon ion-android-cancel"></i>`);
        $deleteIcon.on("click", () => {
            this.getParent().removeItem(this);
        });
        this.$container.append($deleteIcon);
    }
    
    setDirection(value)
    {
        this.setProperty("direction", value);
    }
}
