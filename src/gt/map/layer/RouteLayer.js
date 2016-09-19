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

    async _drawRoute(keyLocations, clearAll)
    {
        const maxAge = clearAll ? 3600 * 12 : 0;
        if (keyLocations && keyLocations[0] && keyLocations[1])
        {
            const timestamp = new Date();
            this.timestamp = timestamp;
            let latlngs = null;
            try
            {
                latlngs = await OsmServiceClient.getInstance().getRoute(keyLocations, maxAge);
            }
            catch (err)
            {
                if (err.statusText === "abort")
                {
                    console.log("getRoute() request cancelled by user.");
                }
                else
                {
                    console.error(err);
                }
                return;
            }
            if (!this.timestamp || this.timestamp <= timestamp)
            {
                this.container.removeLayer(this.route);
                this.route = L.multiPolyline(latlngs);
                this.container.addLayer(this.route);
                if (clearAll)
                {
                    this.fitBounds();
                }
            }
        }
    }

    _onMarkerDrag(marker, markderIndex)
    {
        const locations = this.getKeyLocations();
        locations[markderIndex] = marker.getLatLng();
        this.setKeyLocations(JSON.parse(JSON.stringify(locations)), false);
    }
}
