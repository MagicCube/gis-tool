import ManagedObject from "sap/ui/base/ManagedObject";

export default class ProjectServiceClient extends ManagedObject
{
    metadata = {
        properties: {
            baseUrl: { type: "string", defaultValue: "/api/project" },
        }
    };

    async getProject(projectId)
    {
        const res = await $.ajax({
            url: `${this.getBaseUrl()}/${projectId}`
        });
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
