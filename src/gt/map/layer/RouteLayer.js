import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";

export default class RouteLayer extends Layer
{
    metadata = {
        properties: {
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
        }
    }


    addMarker(latLng)
    {
        const marker = L.marker(latLng, {
            draggable: true
        });
        this.container.addLayer(marker);
        marker.on("dragend", this._marker_ondragend.bind(this));
        return marker;
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
        this.setProperty("keyLocations", keyLocations);
    }
}
