import View from "sap/a/view/View";

export default class ListItem extends View
{
    metadata = {
        properties: {
            text: { type: "string", bindable: true }
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("sap-a-list-item");
        this.$element.data("item", this);
    }

    initLayout()
    {
        super.initLayout();
        this.$container.append(`<span class="text"></span>`);
    }

    afterInit()
    {
        super.afterInit();
    }




    getElementTag()
    {
        return "li";
    }

    getBindingItem()
    {
        const binding = this.getBindingContext();
        if (!binding)
        {
            throw new Error("This ListItem has no binding yet.");
        }
        return binding.getModel().getProperty(binding.getPath());
    }

    setText(value)
    {
        this.setProperty("text", value);
        this.$(".text").text(value !== undefined && value !== null ? value : "");
    }


    removeFromParent()
    {
        if (this.getParent())
        {
            this.getParent().removeItem(this);
        }
    }
}
