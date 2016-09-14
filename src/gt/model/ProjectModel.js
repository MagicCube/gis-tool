import Model from "sap/a/model/Model";
import ProjectServiceClient from "../service/ProjectServiceClient";

export default class ProjectModel extends Model
{
    constructor(...args)
    {
        super(...args);
        this.serviceClient = new ProjectServiceClient();
    }
        
    async loadProject(id = "default")
    {
        const project = await this.serviceClient.getProject(id);
        if (project)
        {
            this.setData(project);
        }
    }
    
    async saveProject()
    {
        const result = await this.serviceClient.updateProject(this.getData());
        if (result.version)
        {
            this.setProperty("version", result.version);
        }
        else
        {
            throw new Error(`#saveProject failed. Server responded with ${result}`);
        }
    }
    
    
    
    
    createItem(path, item)
    {
        const items = this.getProperty("/corridors");
        items.push(item);
    }
    
    updateItem(path, item)
    {
        
    }
    
    removeItem(path, item)
    {
        const items = this.getProperty("/corridors");
        items.splice(items.findIndex(project => project.id === item.id), 1);
    }
}
