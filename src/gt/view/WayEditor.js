import RouteEditor from "./RouteEditor";

export default class WayEditor extends RouteEditor
{
    init()
    {
        super.init();
        this.addStyleClass("gt-way-editor");
    }
    
    _initHeader()
    {
        super._initHeader();
        this.$("header .name").after(`
            <div class="item category">
                <label>
                    <i class="icon ion-pricetag" />
                </label>
                <select>
                  <option value="1">Category 1</option>
                  <option value="2">Category 2</option>
                  <option value="3">Category 3</option>
                </select>
                <i class="icon ion-arrow-down-b dropdown-icon" />
            </div>
        `);
    }
}
