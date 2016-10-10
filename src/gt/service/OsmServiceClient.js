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
        if (gt.service.OsmServiceClient._instance === null)
        {
            gt.service.OsmServiceClient._instance = new gt.service.OsmServiceClient();
        }
        return gt.service.OsmServiceClient._instance;
    }

    async searchCity(cityName)
    {
        if (this.searchCityXhr) {
            this.searchCityXhr.abort();
            this.searchCityXhr = null;
        }
        this.searchCityXhr = $.ajax({
            url: `${this.getBaseUrl()}/city?q=${cityName}`,
            contentType: "application/json"
        });
        
        return new Promise((resolve, reject) => {
            this.searchCityXhr.done(resolve);
            this.searchCityXhr.fail((xhr, status, error) => {
                if (xhr.statusText === "abort")
                {
                    reject("searchCity() request cancelled by user.");
                }
                else
                {
                    reject(error);
                }
            });
        });
    }

    // Supported location format: [lng, lat] and { lat, lng }
    async getRoute(locations, maxAge = 0)
    {
        if (this.getRouteXhr)
        {
            this.getRouteXhr.abort();
            this.getRouteXhr = null;
        }
        locations = locations.map(location => ({
            lat: location.lat,
            lon: location.lng
        }));
        const json = {
            locations: locations,
            costing: "auto"
        }

        let data = undefined;
        if (maxAge)
        {
            data = { maxage: maxAge };
        }
        this.getRouteXhr = $.ajax({
            url: `${this.getBaseUrl()}/route/${JSON.stringify(json)}`,
            data: data
        });

        return new Promise((resolve, reject) => {
            this.getRouteXhr.done(resolve);
            this.getRouteXhr.fail((xhr, status, error) => {
                if (xhr.statusText === "abort")
                {
                    reject("getRoute() request cancelled by user.");
                }
                else
                {
                    reject(error);
                }
            });
        })
    }
}
