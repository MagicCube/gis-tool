import Model from "sap/a/model/Model";
import ProjectServiceClient from "../service/ProjectServiceClient";

export default class ProjectModel extends Model
{
    constructor(...args)
    {
        super(...args);
        this.attachPropertyChange(this._onPropertyChange.bind(this));
    }

    async loadProject(id = "default")
    {
        const project = await ProjectServiceClient.getInstance().getProject(id);
        if (project)
        {
            this.setData(project);
        }
    }

    async saveProject()
    {
        try
        {
            const result = await ProjectServiceClient.getInstance().updateProject(this.getData());
            if (result.version)
            {
                this.setProperty("/version", result.version);
                console.log("Project has been automatically saved.");
            }
        }
        catch (e)
        {
            alert(`Save failed. ${e}`);
        }
    }




    appendItem(path, item)
    {
        const items = this.getProperty(path);
        item.id = uuid.v1();
        items.push(item);
        this._onPropertyChange();
    }

    removeItem(path, item)
    {
        const items = this.getProperty(path);
        items.splice(items.findIndex(i => i.id === item.id), 1);
        this._onPropertyChange();
    }

    _onPropertyChange()
    {
        if (this._autoSaveTimer)
        {
            clearTimeout(this._autoSaveTimer);
            this._autoSaveTimer = null;
        }
        this._autoSaveTimer = setTimeout(() => {
            this._autoSaveTimer = null;
            this.saveProject();
        }, 200);
    }
}
