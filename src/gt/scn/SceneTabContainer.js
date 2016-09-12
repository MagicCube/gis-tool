import SceneContainer from "sap/a/scn/SceneContainer";
import SplitLayout from "sap/a/layout/SplitLayout";

export default class SceneTabContainer extends SceneContainer
{
    init()
    {
        super.init();
        this.addStyleClass("gt-scene-tab-container");
    }

    initLayout()
    {
        this.setLayout(new SplitLayout({
            ratio: [ 38, undefined ]
        }));
        this._initTabs();
        const $scenePlaceholder = $(`<div class="scene-placeholder">`);
        this.$element.find(".sub-container:nth-child(2)").append($scenePlaceholder);
        this.$container = $scenePlaceholder;
    }

    _initTabs()
    {
        const $ul = $(`<ul>
            <li class="selected">CITY</li>
            <li>CORRIDORS</li>
            <li>KEYROUTES</li>
            <li>WAYS</li>
        </ul>`);
        this.getLayout().append($ul);
    }
}
