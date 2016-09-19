import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";

export default class RouteLayer extends Layer
{
    metadata = {
        properties: {
            keyLocations: { type: "object", bindable: true }
        }
    };

    setKeyLocations(value, isUserDrag = false)
    {
        this.setProperty("keyLocations", value);
        // this.container.clearLayers();
        if (value)
        {
            if(!isUserDrag)
            {
                this._drawMarker(value);
            }
            this._drawRoute(value, isUserDrag);
        }
    }
    
    _drawMarker(locations)
    {
        locations.forEach((point, i) => {
            if (point && point.lat && point.lng)
            {
                const marker = L.marker(point, {
                    draggable: true,
                    title: i === 0 ? "Origin" : (i === locations.length - 1 ? "Destination" : i)
                });
                // 处理point为空的情况
                marker.on("drag", e => {
                    if (this._dragTimer)
                    {
                        clearTimeout(this._dragTimer);
                    }
                    this._dragTimer = setTimeout(this._onMarkerDrag.bind(this, marker, i), 200);
                });
                this.container.addLayer(marker);
            }
        });
    }
    
    async _drawRoute(locations, isUserDrag)
    {
        const maxAge = isUserDrag ? 0 : 3600 * 12;
        if (locations && locations.length > 0)
        {
            const latlngs = await OsmServiceClient.getInstance().getRoute(locations, maxAge);
            const multiPolyline = L.multiPolyline(latlngs);
            this.container.addLayer(multiPolyline);
            if (!isUserDrag)
            {
                this.fitBounds();                
            }
        }
    }
    
    _onMarkerDrag(marker, markderIndex)
    {
        const locations = this.getKeyLocations();
        locations[markderIndex] = marker.getLatLng();
        this.setKeyLocations(locations, true);
    }
}
