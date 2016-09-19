import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";

export default class RouteLayer extends Layer
{
    metadata = {
        properties: {
            keyLocations: { type: "object", bindable: true }
        }
    };

    setKeyLocations(value)
    {
        this.setProperty("keyLocations", value);
        this.container.clearLayers();
        if (value)
        {
            value.forEach((point, i) => {
                if (point && point.lat && point.lng)
                {
                    const marker = L.marker(point, {
                        draggable: true,
                        title: i === 0 ? "Origin" : (i === value.length - 1 ? "Destination" : i)
                    });
                    // 处理point为空的情况
                    this.container.addLayer(marker);
                }
            });
        }
        this._drawRoute(3600 * 12);
    }
    
    async _drawRoute(maxAge = 0)
    {
        const locations = this.getKeyLocations();
        if (locations && locations.length > 0)
        {
            const latlngs = await OsmServiceClient.getInstance().getRoute(locations, maxAge);
            const multiPolyline = L.multiPolyline(latlngs).addTo(this.getParent().map);
            this.getParent().setBounds(multiPolyline.getBounds());
        }
    }
}
