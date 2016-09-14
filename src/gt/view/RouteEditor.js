import View from "sap/a/view/View";

export default class RouteEidtor extends View
{
    init()
    {
        super.init();
        this.addStyleClass("gt-route-editor");
        this._initLayout();
    }

    _initLayout()
    {
        this.$header = $(`<header />`);
        this.$main = $(`<main />`);
        this.initHeader();
        this.initMain();
        this.$container.append(this.$header);
        this.$container.append(this.$main);
    }

    initHeader()
    {

    }

    initMain()
    {

    }
}
