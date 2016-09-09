import ManagedObject from "sap/ui/base/ManagedObject";

export default class Layer extends ManagedObject
{
    constructor(...args)
	{
		super(...args)
		this.afterInit();
	}

    init()
    {
        this.container = L.featureGroup();
    }

    afterInit()
    {

    }



    isVisible()
    {
        return this.getParent() !== null && this.getParent().map.hasLayer(this.container);
    }

    getBounds()
    {
        return this.container.getBounds();
    }

    fitBounds()
    {
        if (this.getParent())
        {
            this.getParent().setBounds(this.getBounds());
        }
    }

    refresh()
    {
        this.container.redraw();
    }

    removeFromParent()
    {
        const parent = this.getParent();
        if (parent)
        {
            parent.removeLayer(this);
        }
    }
}
