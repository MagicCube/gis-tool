import ManagedObject from "sap/ui/base/ManagedObject";

export default class Layout extends ManagedObject
{
    constructor(...args)
    {
        super(...args);

        this._childrenCount = 0;

        this.afterInit();
    }

    init()
    {

    }

    afterInit()
    {

    }

    attach($element)
    {
        this.$element = $element;
    }

    append($child)
    {

    }

    getChildrenCount()
    {
        return this._childrenCount;
    }
}
