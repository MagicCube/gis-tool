import ManagedObject from "sap/ui/base/ManagedObject";

export default class ServiceClient extends ManagedObject
{
    metadata = {
        properties: {
            baseUrl: { type: "string", defaultValue: "/api/project" },
        }
    };

    static _instance = null;
    static getInstance()
    {
        if (gt.service.ServiceClient._instance === null)
        {
            gt.service.ServiceClient._instance = new gt.service.ServiceClient();
        }
        return gt.service.ServiceClient._instance;
    }

    async getProject(projectId)
    {
        const res = await $.ajax(`${this.getBaseUrl()}/${projectId}`);
        return res;
    }

    async updateProject(project)
    {
        const data = JSON.stringify(project);
        if (data.length > 1024 * 1024)
        {
            throw new Error("GeoJson too large");
        }
        const res = await $.ajax({
            url: `${this.getBaseUrl()}/${project.id}`,
            method: "PUT",
            contentType: "application/json",
            data
        });
        return res;
    }
}
