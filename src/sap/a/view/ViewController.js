import ManagedObject from "sap/ui/base/ManagedObject";

import View from "./View";

export default class ViewController extends ManagedObject
{
    metadata = {
        aggregations: {
            childViewControllers: {
                type: "sap.a.view.ViewController"
            }
        },
        properties: {
            viewOptions: { type: "object" }
        }
    };

    constructor(...args)
    {
        super(...args);
        this.afterInit();
    }

    init()
	{

    }

    afterInit()
    {
        this.view = this.createView(this.getViewOptions());
        if (this.view instanceof View)
        {
            this.initView();
            this.initChildViewControllers();
        }
        else
        {
            throw new Error("createView(options) must return an instance of sap.a.view.View.");
        }
    }

    initView()
    {

    }

    initChildViewControllers()
    {

    }

    getView()
    {
        return this.view;
    }

    createView(options)
    {
        throw new Error("createView(options) must be override in the derived class.");
    }




    addChildViewController(viewController, $container)
    {
        this.addAggregation("childViewControllers", viewController);
        this.view.addSubview(viewController.view, $container);
        return this;
    }

    removeChildViewController(viewController, neverUseAgain)
    {
        const result = this.removeAggregation("childViewControllers", viewController);
        if (result)
        {
            this.view.removeSubview(viewController.view, neverUseAgain);
        }
        return result;
    }

    removeAllChildViewController(neverUseAgain)
    {
        while (this.getChildViewControllers().length > 0)
        {
            this.removeChildViewController(this.getChildViewControllers()[0], neverUseAgain);
        }
    }

    destroyChildViewControllers(suppressInvalidate)
    {
        this.removeAllChildViewController(true);
        this.destroyAggregation("childViewController", suppressInvalidate);
    }

    removeFromParent()
    {
        if (this.getParent())
        {
            this.getParent().removeChildViewController(this);
        }
    }




    setModel(model, name)
    {
        super.setModel(model, name);
        if (this.view)
        {
            this.view.setModel(model, name);
        }
    }
}
