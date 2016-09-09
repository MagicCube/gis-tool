import Layout from "./Layout";

export default class AlignLayout extends Layout
{
    metadata = {
        properties: {
            // align: [ horizontal(left, center, right), vertical(top, center, bottom) ]
            align: { type: "object", defaultValue: [ "left", "top" ] }
        }
    }

    attach($element)
    {
        super.attach($element);
        this.$element.addClass("sap-a-align-layout");

        const align = this.getAlign();
        this.$element.addClass(`align-horizontal-${align[0]} align-vertical-${align[1]}`);

        this.$subContainer = $(`<div class="sub-container" />`);
        this.$element.append(this.$subContainer);

    }

    append($child)
    {
        const childrenCount = this.getChildrenCount();
        if (childrenCount >= 1)
        {
            throw new Error(`The count of children containers can't be more than 1.`);
        }
        this.$subContainer.append($child);
        this._childrenCount++;
    }

}
