import BaseApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";

export default class ApplicationController extends BaseApplicationController
{
    createView()
    {
        const app = new Application();
        app.addStyleClass("gt-app");
        return app;
    }

    run()
    {
        super.run();
        console.log("App is running......");
    }
}
