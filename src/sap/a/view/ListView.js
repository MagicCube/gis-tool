import View from "sap/a/view/View";

import ListItem from "./ListItem";

export default class ListView extends View
{
    metadata = {
        aggregations: {
    		items: { type: "sap.a.view.ListItem", bindable: true }
    	},
        events: {
            itemClick: { parameters: { item: { type: "sap.a.view.ListItem" } } }
        }
    };

    init()
    {
        super.init();

        this.$element.on("mousedown", ".sap-a-list-item", this._onmousedown.bind(this));
    }



    getElementTag()
    {
        return "ul";
    }




    bindAggregation(name, bindingArgs)
    {
        if (name === "items")
        {
            let bindingInfo = bindingArgs;
            if (typeof(bindingArgs) === "string")
            {
                bindingInfo = {
                    path: bindingArgs
                };
            }
            else if (bindingArgs === undefined || bindingArgs === null)
            {
                throw new Error("In bindItems(bindingInfo), bindingInfo can not be null or undefined.");
            }

            if (!bindingInfo.factory && !bindingInfo.template)
            {
                bindingInfo.template = this.getItemTemplate();
            }

            return super.bindAggregation("items", bindingInfo);
        }
        else
        {
            return super.bindAggregation(name, bindingArgs);
        }
    }

    getItemTemplate()
    {
        if (!this._itemTemplate)
        {
            this._itemTemplate = this.createItemTemplate();
        }
        return this._itemTemplate;
    }

    createItemTemplate()
    {
        const listItem = new ListItem({
            text: "{name}"
        });
        return listItem;
    }

    addSubview(subview, $container)
    {
        if (subview instanceof ListItem)
        {
            console.warn("Use addItem(item) instead to add a ListItem object.");
        }
        super.addSubview(subview, $container);
    }





    getBindingItems()
    {
        const binding = this.getBinding("items");
        if (!binding)
        {
            throw new Error("The aggregation 'items' has no binding yet.");
        }
        const list = binding.getModel().getProperty(binding.getPath());
        return list;
    }

    addItem(item)
    {
        if (item.getParent())
        {
            item.removeFromParent();
        }
        this.addAggregation("items", item);
        item.placeAt(this.$container);
        return this;
    }

    removeItem(item, neverUseAgain = false)
    {
        const result = this.removeAggregation("items", item);
        if (result)
        {
            if (neverUseAgain)
            {
                item.$element.remove();
            }
            else
            {
                item.$element.detach();
            }
        }
        return result;
    }

    removeAllItems(neverUseAgain = false)
    {
        while (this.getItems().length > 0)
        {
            this.removeItem(this.getItems()[0], neverUseAgain);
        }
    }

    destroyItems(suppressInvalidate)
    {
        this.removeAllItems(true);
        this.destroyAggregation("items", suppressInvalidate);
    }



    _onmousedown(e)
    {
        const $item = $(e.currentTarget);
        const item = $item.data("item");
        this.fireItemClick({
            item
        });
    }
}
