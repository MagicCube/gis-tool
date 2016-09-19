import Layer from "sap/a/map/layer/Layer";

export default class BoundLayer extends Layer {
    metadata = {
        properties: {
            cityBounds: { type: "object", bindable: true }  //array of array
        },
    };
    
    afterInit() {
        super.afterInit();
    }
    
    _initRect() {
        const bounds = this.getCityBounds();
        this.editableRectangle = L.rectangle(bounds, {
            color: "black",
            opacity: 0.8,
            weight: 2
        });
        this.container.addLayer(this.editableRectangle);
        
        this.editableRectangle.editing.enable();
		this.editableRectangle.on("edit", e => {
            const [bottomLeft, topLeft, topRight, bottomRight] = e.target.getLatLngs();
            console.log(bottomLeft, topLeft, topRight, bottomRight);
		});
    }
    
    setCityBounds(value)
    {
        this.setProperty("cityBounds", value);
        this._initRect();        
    }
}
