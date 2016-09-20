import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";
import GisUtil from "../../gis/GisUtil";

export default class RouteLayer extends Layer
{
    metadata = {
        properties: {
            direction: { type: "int", bindable: true },
            keyLocations: { type: "object", bindable: true }
        }
    };

    init()
    {
        super.init();
        this.markers = [];
    }

    setKeyLocations(value)
    {
        this.setProperty("keyLocations", value);
        this.container.clearLayers();
        this.markers = [];
        if (value)
        {
            value.forEach(latLng => {
                if (latLng.lat && latLng.lng)
                {
                    const marker = this.addMarker(latLng);
                    this.markers.push(marker);
                }
            });
            this.drawRoute({
                maxAge: 3600,
                fitBounds: true
            });
        }
    }


    addMarker(latLng)
    {
        const marker = L.marker(latLng, {
            draggable: true
        });
        this.container.addLayer(marker);
        marker.on("drag", this._marker_ondragover.bind(this));
        marker.on("dragend", this._marker_ondragend.bind(this));
        return marker;
    }


    drawRoute({
        maxAge = 0,
        fitBounds = false
    } = {})
    {
        const keyLocations = this.markers.map(marker => {
            const latLng = marker.getLatLng()
            return latLng;
        });
        if (keyLocations && keyLocations[0] && keyLocations[0].lat && keyLocations[1] && keyLocations[1].lat)
        {
            OsmServiceClient.getInstance().getRoute(keyLocations, maxAge)
                .then(latlngs => {
                    this.container.removeLayer(this.route);
                    this.route = L.multiPolyline(latlngs);
                    this.container.addLayer(this.route);
                    if (fitBounds)
                    {
                        this.fitBounds();
                    }
                })
                .catch(reason => {
                    console.log(reason);
                });
        }
    }






    onExternalDragOver(e)
    {
        let marker = null;
        const markerName = e.dataTransfer.types[0];
        if (markerName === "origin")
        {
            if (this.markers[0])
            {
                marker = this.markers[0];
            }
            else
            {
                marker = this.addMarker(e.latLng);
                this.markers[0] = marker;
            }
        }
        else if (markerName === "destination")
        {
            if (this.markers.length > 1)
            {
                marker = this.markers[this.markers.length - 1];
            }
            else
            {
                marker = this.addMarker(e.latLng);
                this.markers[1] = marker;
            }
        }
        if (marker)
        {
            marker.setLatLng(e.latLng);
            this._marker_ondragover();
        }
    }

    onExternalDrop(e)
    {
        let marker = null;
        const markerName = e.dataTransfer.types[0];
        if (markerName === "origin")
        {
            marker = this.markers[0];
        }
        else if (markerName === "destination")
        {
            marker = this.markers[this.markers.length - 1];
        }
        if (marker)
        {
            this._marker_ondragend({
                target: marker
            });
        }
    }

    _marker_ondragover(e)
    {
        if (this._dragTimer)
        {
            clearTimeout(this._dragTimer);
        }
        this._dragTimer = setTimeout(this.drawRoute.bind(this, {
            maxAge: 3600
        }), 200);
    }

    _marker_ondragend(e)
    {
        const marker = e.target;
        const index = this.markers.indexOf(marker);
        const keyLocations = JSON.parse(JSON.stringify(this.getKeyLocations()));
        if (!keyLocations[index])
        {
            keyLocations[index] = {};
        }
        keyLocations[index].lat = marker.getLatLng().lat;
        keyLocations[index].lng = marker.getLatLng().lng;

        const direction = GisUtil.getHeading(keyLocations[0], keyLocations[keyLocations.length - 1]);
        if (!isNaN(direction))
        {
            this.setProperty("direction", parseInt(direction));
        }

        this.setProperty("keyLocations", keyLocations);
    }
}
