import Model from "sap/a/model/Model";
import ProjectServiceClient from "../service/ProjectServiceClient";

const PROJECT_ID_OF_NANJING = "2131524";

export default class ProjectModel extends Model
{
    constructor(...args)
    {
        super(...args);
        this.attachPropertyChange(this._onPropertyChange.bind(this));
    }

    async loadProject(id = PROJECT_ID_OF_NANJING)
    {
        try
        {
            const project = await ProjectServiceClient.getInstance().getProject(id);
            this.setData(project);
        }
        catch (e)
        {
            throw new Error(`Project ${id} not found.`);
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
                const id = this.getData().id;
                console.log(`Project ${id} has been automatically saved.`);
            }
        }
        catch (e)
        {
            throw new Error(`Save failed. ${e}`);
        }
    }

    async saveProjectAs(name)
    {
        try
        {
            await ProjectServiceClient.getInstance().saveProjectAs(this.getData(), name);
            let code = '';
            if (this.getData().city) {
                code = this.getData().city.code;
            }
            console.log(`Project ${code} has been uploaded`);
        }
        catch (e)
        {
            throw new Error(`Project uploading failed. ${e}`);
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
        }, 400);
    }
}
