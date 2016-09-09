import MutipleLayout from "./MutipleLayout";

const HORIZONTAL = 0;
const VERTICAL = 1;

export default class SplitLayout extends MutipleLayout
{
    static HORIZONTAL = HORIZONTAL;
    static VERTICAL = VERTICAL;

    metadata = {
        properties: {
            direction: { type: "int", defaultValue: VERTICAL },
            // ratio can be: [ 200, undefined], [ undefined, 200], [ 20%, undefined ], [ undefined, 20% ]
            ratio: { type: "object", defaultValue: [ "50%", undefined ] }
        }
    };

    attach($element)
    {
        super.attach($element);

        this._setSubContainersStyle($element);

        this.$element.addClass("sap-a-split-layout");
        if (this.getDirection() === HORIZONTAL)
        {
            this.$element.addClass("split-horizontal-layout");
        }
        else if (this.getDirection() === VERTICAL)
        {
            this.$element.addClass("split-vertical-layout");
        }
        else
        {
            throw new Error("The direction must be horizontal or vertical.");
        }
    }

    getContainerCount()
    {
        return 2;
    }

    _setSubContainersStyle($element)
    {
        const $subContainer1 = $($element.children()[0]);
        const $subContainer2 = $($element.children()[1]);

        const direction = this.getDirection();
        const ratio = this.getRatio();

        if (direction === HORIZONTAL)
        {
            $subContainer1.css({
                "width": ratio[0],
                "flex-grow": ratio[0] ? 0 : 1,
                "flex-basis": ratio[0] ? "auto" : 0
            });
            $subContainer2.css({
                "width": ratio[1],
                "flex-grow": ratio[1] ? 0 : 1,
                "flex-basis": ratio[1] ? "auto" : 0
            });
        }
        else {
            $subContainer1.css({
                "height": ratio[0],
                "flex-grow": ratio[0] ? 0 : 1,
                "flex-basis": ratio[0] ? "auto" : 0
            });
            $subContainer2.css({
                "height": ratio[1],
                "flex-grow": ratio[1] ? 0 : 1,
                "flex-basis": ratio[1] ? "auto" : 0
            });
        }
    }
}
