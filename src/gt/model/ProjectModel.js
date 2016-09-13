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
}