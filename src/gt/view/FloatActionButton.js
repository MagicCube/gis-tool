import View from "sap/a/view/View";

export default class FloatActionButton extends View
{
    metadata = {
        properties: {
            icon: { type: "string", defaultValue: "ion-plus" }
        },
        events: {
            click: { }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("gt-float-action-button");

        const $icon = $(`<i class="icon ${this.getIcon()}"></i>`);
        this.$container.append($icon);
        this.$container.on("click", () => {
            alert("fab click");
            this.fireClick();
        });
    }
}
