import ListView from "sap/a/view/ListView";

import RouteListItem from "./RouteListItem";

export default class RouteListView extends ListView
{    
    init()
    {
        super.init();
        this.addStyleClass("gt-route-list-view");
    }
    
    createItemTemplate()
    {
        const listItem = new RouteListItem({
            text: "{project>name}",
            direction: "{project>direction}"
        });
        return listItem;
    }
}