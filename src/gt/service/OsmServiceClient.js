import ManagedObject from "sap/ui/base/ManagedObject";

export default class OsmServiceClient extends ManagedObject
{
    metadata = {
        properties: {
            baseUrl: { type: "string", defaultValue: "/api/osm" },
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

    async searchCity(cityName)
    {
        const res = await $.ajax(`${this.getBaseUrl()}/city?q=${cityName}`);
        return res;
    }

    async getRelation(osmId)
    {
        const res = await $.ajax(`${this.getBaseUrl()}/relation/${osmId}`);
        return res;
    }

    // Supported location format: [lng, lat] and { lat, lng }
    async getRoute(locations)
    {
        if (locations.length > 0 && Array.isArray(locations[0]))
        {
            locations = locations.map(location => ({
                lat: location[0],
                lng: location[1]
            }));
        }
        locations = locations.map(location => ({
            lat: location.lat,
            lon: location.lng
        }));
        const json = {
            locations: locations,
            costing: "auto"
        }
        const res = await $.ajax(`${this.getBaseUrl()}/route/${JSON.stringify(json)}`);
        return res;
    }
}
