import Layer from "sap/a/map/layer/Layer";

import OsmServiceClient from "../../service/OsmServiceClient";

export default class BoundLayer extends Layer {
    metadata = {
        properties: {
            osmId: { type: "string", bindable: true },
            cityBounds: { type: "object", bindable: true }  //array of array
        },
    };
    
    _drawBounds() {
        const bounds = this.getCityBounds();
        this.rectangle = L.rectangle(bounds, {
            color: "rgb(0, 51, 255)",
            opacity: 0.8,
            weight: 2
        });
        
        this.rectangle.editing.enable();
		this.rectangle.on("edit", e => {
            const [bottomLeft, topLeft, topRight, bottomRight] = e.target.getLatLngs();
            this.setCityBounds([bottomLeft, topRight], false);
		});
        
        this.container.addLayer(this.rectangle);
        this.fitBounds();
    }
    
    setCityBounds(value, clearLayers = true)
    {
        this.setProperty("cityBounds", value);
        if (value && clearLayers)
        {
            this.container.clearLayers();
            this._drawBounds();
        }
    }
    
    setOsmId(value)
    {
        OsmServiceClient.getInstance().getRelation(value).then(relation => {
            const layer = L.geoJson(relation, {
                style: function(feature) {
                    switch (feature.properties.tags.admin_level) {
                        case '6': return { color: "#ff0000" };
                        default: return { color: "rgba(0, 0, 0, 0)" };
                    }
                }
            });
            this.container.addLayer(layer);
            this.fitBounds();
        });
    }
}
