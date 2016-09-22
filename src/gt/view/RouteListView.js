import ListView from "sap/a/view/ListView";

import RouteListItem from "./RouteListItem";

export default class RouteListView extends ListView
{
    metadata = {
        events: {
            itemDelete: { parameters: { item: "object"} }
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("gt-route-list-view");
        this._initPrompt();
    }
    
    _initPrompt()
    {
        this.$prompt = $(`<div class="prompt">Click the button at bottom right to create route.</div>`)
        this.$container.append(this.$prompt);
    }

    createItemTemplate()
    {
        const listItem = new RouteListItem({
            route: "{project>}",
            text: "{project>name}",
            direction: "{project>direction}"
        });
        return listItem;
    }
    
    addItem(item)
    {
        super.addItem(item);
        this.hidePrompt();
    }
    
    removeItem(item, neverUseAgain)
    {
        super.removeItem(item, neverUseAgain);
        if (this.getItems().length === 0)
        {
            this.showPrompt();            
        }
    }
    
    showPrompt()
    {
        this.$prompt.show();        
    }
    
    hidePrompt()
    {
        this.$prompt.hide();
    }
}
