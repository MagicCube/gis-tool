import SceneContainer from "sap/a/scn/SceneContainer";
import SplitLayout from "sap/a/layout/SplitLayout";

export default class SceneTabContainer extends SceneContainer
{
    init()
    {
        super.init();
        this.scenes = [];
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
        this.$ul = $(`<ul></ul>`);
        this.getLayout().append(this.$ul);
        this.$ul.on("click", "li", e => {
            const $li = $(e.currentTarget);
            const id = $li.attr("id");
            this.selectScene(id);
        });
    }



    appendScene(scene)
    {
        this.scenes.push(scene);
        this.scenes[scene.getId()] = scene;

        const $li = $(`<li>`);
        $li.attr("id", scene.getId());
        $li.text(scene.getTitle());
        this.$ul.append($li);
    }



    selectScene(id)
    {
        const currentScene = this.getScene();
        if (currentScene)
        {
            if (currentScene.getId() === id)
            {
                return;
            }

            this.$ul.find("#" + currentScene.getId()).removeClass("selected");
        }
        const $li = this.$ul.find("#" + id);
        $li.addClass("selected");
        this.setScene(this.scenes[id], this.$container);
    }
}
