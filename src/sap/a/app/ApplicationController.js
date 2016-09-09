import ViewController from "../view/ViewController";

export default class ApplicationController extends ViewController
{
    constructor(...args)
    {
        super(...args);
        sap.a.app.ApplicationController._instance = this;
    }

    static _instance = null;
    static getInstance()
    {
        return sap.a.app.ApplicationController._instance;
    }

    getApplication()
    {
        return this.getView();
    }

    run()
    {

    }
}
