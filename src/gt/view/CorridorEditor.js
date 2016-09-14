import RouteEditor from "./RouteEditor";

export default class CorridorEditor extends RouteEditor
{
    initHeader()
    {
        super.initHeader();
        this.$header.append(`
            <div class="item">
                <label>NAME</label>
                <input type="text" />
            </div>
            <div class="item">
                <label>DIRECTION</label>
                <input type="text" />
            </div>
        `);
    }

    initMain()
    {
        super.initMain();
    }
}
