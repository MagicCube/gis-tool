import View from "sap/a/view/View";

export default class AppBar extends View
{
    metadata = {
        properties: {
            title: { type: "string", bindable: true },
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("gt-app-bar");
        this.$logo = $(`<i class="logo icon ion-map"></i>`);
        this.$container.append(this.$logo);
        this.$h1 = $(`<h1/>`);
        this.$container.append(this.$h1);
    }

    setTitle(title)
    {
        this.setProperty("title", title);
        this.$h1.text(title);
    }
}
