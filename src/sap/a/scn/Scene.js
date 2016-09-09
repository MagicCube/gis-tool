import View from "sap/a/view/View";

export default class Scene extends View
{
    metadata = {
        properties: {
            title: { type: "string" }
        },
        events: {
            titleChange: {  },
            deactivated: {  },
            activated: {  }
        }
    }

    init()
    {
        super.init();
        this.addStyleClass("sap-a-scene");
        this._active = true;
    }

    afterInit()
    {
        super.afterInit();
    }


    setTitle(value)
    {
        if (this.getTitle() !== value)
        {
            this.setProperty("title", value);
            this.fireTitleChange();
        }
    }

    isActive()
    {
        return this._active;
    }

    activate()
    {
        this._active = true;
        this.fireActivated();
    }

    deactivate()
    {
        this._active = false;
        this.fireDeactivated();
    }
}
