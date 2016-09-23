import ListView from "sap/a/view/ListView";

import RouteListItem from "./RouteListItem";

export default class RouteListView extends ListView
{
    metadata = {
        properties: {
            selection: { type: "gt.view.RouteListItem" }
        },
        events: {
            itemDelete: { parameters: { item: "object"} },
            selectionChange: { }
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("gt-route-list-view");
        this._initPrompt();
        this.attachItemClick(e => {
            const item = e.getParameters().item;
            this.setSelection(item, true);
        });
    }
    
    _initPrompt()
    {
        this.$prompt = $(`<div class="prompt">No route found in this project. Please click the "+" button at bottom right to create route.</div>`)
        this.$container.append(this.$prompt);
    }
    
    setSelection(selection, fireSelectionChange = false)
    {
        const prevSelection = this.getSelection();
        if (!prevSelection || prevSelection !== selection)
        {
            if (prevSelection)
            {
                prevSelection.setSelected(false);                
            }
            if (selection)
            {
                selection.setSelected(true);
            }
            this.setProperty("selection", selection);
            if (fireSelectionChange)
            {
                this.fireSelectionChange();
            }
        }
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
        this.$prompt.hide();
    }
    
    removeItem(item, neverUseAgain)
    {
        super.removeItem(item, neverUseAgain);
        if (this.getItems().length === 0)
        {
            this.$prompt.show();                 
        }
    }    
}
