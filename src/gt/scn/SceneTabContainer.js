import SceneContainer from "sap/a/scn/SceneContainer";
import SplitLayout from "sap/a/layout/SplitLayout";

import ProjectServiceClient from "../service/ProjectServiceClient";

export default class SceneTabContainer extends SceneContainer
{
    metadata = {
        properties: {
            projectId: { type: "string", bindable: true }
        }
    };

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
        this.$nav = $(`<nav />`);
        this._initTabs();
        this._initActions();
        this.getLayout().append(this.$nav);

        const $scenePlaceholder = $(`<div class="scene-placeholder">`);
        this.$element.find(".sub-container:nth-child(2)").append($scenePlaceholder);
        this.$container = $scenePlaceholder;
    }

    _initTabs()
    {
        this.$tabs = $(`<ul class="tabs"></ul>`);
        this.$tabs.on("click", "li", e => {
            const $li = $(e.currentTarget);
            const id = $li.attr("id");
            this.selectScene(id);
        });
        this.$nav.append(this.$tabs);
    }

    _initActions()
    {
        this.$buttons = $(`
            <ul class="buttons">
                <li class="save-button">
                    <i class="icon ion-ios-copy"></i>
                </li>
                <li class="download-button">
                    <a href="../api/project/download/default" onclick="javascript:void(0)">
                        <i class="icon ion-android-download"></i>
                    </a>
                </li>
            </ul>
        `);
        this.$buttons.find(".save-button").click(() => {
            const project = this.getModel("project").getData();
            if (project.city && project.city.code)
            {
                this.getModel("project")
                    .saveProjectAs(project.city.code, true)
                    .then(() => {
                    })
                    .catch(reason => {
                        alert(`Project uploading failed. ${reason}`);
                    });
            }
            else
            {
                alert("City code is required");
            }
        });
        this.$nav.append(this.$buttons);
    }

    setProjectId(value)
    {
        this.setProperty("projectId", value);
        this.$element.find("li.download-button > a").attr("href", `../api/project/download/${value}`);
    }

    appendScene(scene)
    {
        this.scenes.push(scene);
        this.scenes[scene.getId()] = scene;

        const $li = $(`<li>`);
        $li.attr("id", scene.getId());
        $li.text(scene.getTitle());
        this.$tabs.append($li);
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

            this.$tabs.find("#" + currentScene.getId()).removeClass("selected");
        }
        const $li = this.$tabs.find("#" + id);
        $li.addClass("selected");
        this.setScene(this.scenes[id], this.$container);
    }
}
