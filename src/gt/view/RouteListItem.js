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
        this.$container.append(`<span class="direction-icon iconfont"></span>`);
        super.initLayout();
        const $deleteIcon = $(`<span class="delete-icon iconfont icon-close"></span>`);
        $deleteIcon.on("click", () => {
            this.getParent().removeItem(this);
        });
        this.$container.append($deleteIcon);
    }
    
    setDirection(value)
    {
        this.setProperty("direction", value);
        if (value === 0)
        {
            this.$(".direction-icon").addClass("icon-directiondown");
        }
        else
        {
            this.$(".direction-icon").addClass("icon-directionup");
        }
    }
}
