import ManagedObject from "sap/ui/base/ManagedObject";

export default class ServiceClient extends ManagedObject
{
    metadata = {
        properties: {
            baseUrl: { type: "string", defaultValue: "localhost:8080/api/osm" },
        }
    };
    
    async searchCity(cityName)
    {
        const res = await this.fetch(`/city?q=${cityName}`);
        return res;
    }
    
    async getRelation(osmId)
    {
        const res = await this.fetch(`/relation/${osmId}`);
        return res;
    }
    
    // Supported point type: Leaflet.LatLng, Array and {lat, lng}
    async getRoute(thruPoints)
    {
        if (thruPoints.length > 0 && Array.isArray(thruPoints[0]))
        {
            thruPoints = thruPoints.map(point => {lat: point.[0], lng: point[1]});
        }
        const tpString = thruPoints.map(point => `${point.lat},${point.lng}`).join(";");
        const res = await this.fetch(`/route/${tpString}`);
        return res;
    }
}
