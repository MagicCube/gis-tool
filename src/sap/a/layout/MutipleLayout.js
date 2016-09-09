import Layout from "./Layout";

export default class MutipleLayout extends Layout
{
    init()
    {
        super.init();

        this._initContainers();
    }

    attach($element)
    {
        super.attach($element);
        this.$element.addClass("sap-a-multi-layout");
        for (let i = 0; i < this.getContainerCount(); i++)
        {
            this.$element.append(this.$containers[i]);
        }
    }

    _initContainers()
    {
        this.$containers = [];
        for (let i = 0; i < this.getContainerCount(); i++)
        {
            this.$containers[i] = $(`<div class="sub-container" />`);
        }
    }

    append($child)
    {
        const childrenCount = this.getChildrenCount();
        if (childrenCount >= this.getContainerCount())
        {
            throw new Error(`The count of children containers can't be more than ${this.getContainerCount()}.`);
        }
        this.$containers[childrenCount].append($child);
        this._childrenCount++;
    }

    getContainerCount()
    {
        throw new Error("#getContainerCount() must be overrided.");
    }
}
