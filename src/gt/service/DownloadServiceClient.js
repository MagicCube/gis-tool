import ManagedObject from "sap/ui/base/ManagedObject";

export default class DownloadServiceClient extends ManagedObject
{
    metadata = {
        properties: {
            baseUrl: { type: "string", defaultValue: "/api/download" },
        }
    };

    static _instance = null;
    static getInstance()
    {
        if (gt.service.DownloadServiceClient._instance === null)
        {
            gt.service.DownloadServiceClient._instance = new gt.service.DownloadServiceClient();
        }
        return gt.service.DownloadServiceClient._instance;
    }

    async downloadConvertedFiles(id = "default")
    {
        const res = await $.ajax({
            url: `${this.getBaseUrl()}/${id}`,
            method: "GET"
        });
        return res;
    }
}
