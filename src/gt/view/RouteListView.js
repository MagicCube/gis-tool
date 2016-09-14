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
    }
    
    createItemTemplate()
    {
        const listItem = new RouteListItem({
            route: "{project>}"
        });
        return listItem;
    }
}
