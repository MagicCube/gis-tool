import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";

export default class RouteLayer extends Layer
{
    metadata = {
        properties: {
            keyLocations: { type: "object", bindable: true }
        }
    };

    setKeyLocations(value, clearAll = true)
    {
        this.setProperty("keyLocations", value);
        if (clearAll)
        {
            this.container.clearLayers();
        }
        if (value)
        {
            this._drawMarker(value, clearAll);
            this._drawRoute(value, clearAll);
        }
    }
    
    _drawMarker(keyLocations, clearAll)
    {
        if (!clearAll)
        {
            return;
        }
        keyLocations.forEach((location, i) => {
            if (location && location.lat && location.lng)
            {
                const marker = L.marker(location, {
                    draggable: true,
                    title: i === 0 ? "Origin" : (i === keyLocations.length - 1 ? "Destination" : i)
                });
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
    
    _drawRoute(keyLocations, clearAll)
    {
        const maxAge = clearAll ? 3600 * 12 : 0;
        if (keyLocations && keyLocations.length > 0)
        {
            OsmServiceClient.getInstance().getRoute(keyLocations, maxAge)
                .then(latlngs => {
                    this.container.removeLayer(this.route);
                    this.route = L.multiPolyline(latlngs);
                    this.container.addLayer(this.route);
                    if (clearAll)
                    {
                        this.fitBounds();                
                    }
                })
                .catch(reason => {
                    console.log(reason);
                });
        }
    }
    
    _onMarkerDrag(marker, markderIndex)
    {
        const locations = this.getKeyLocations();
        locations[markderIndex] = marker.getLatLng();
        this.setKeyLocations(locations, false);
    }
}
