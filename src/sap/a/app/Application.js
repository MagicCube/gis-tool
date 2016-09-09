import View from "../view/View";

export default class Application extends View
{
    constructor(...args)
    {
        super(...args);
        sap.a.app.Application._instance = this;
    }

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("sap-a-app");
    }

    static _instance = null;
    static getInstance()
    {
        return sap.a.app.Application._instance;
    }
}
