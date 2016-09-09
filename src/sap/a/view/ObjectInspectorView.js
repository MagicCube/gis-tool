import View from "../view/View";

export default class ObjectInspectorView extends View
{
    metadata = {
		properties: {
			title: { type: "string", defaultValue: "Title" },
            value: { type: "any", bindable: true }
		}
    };

    init()
    {
        super.init();
        this.addStyleClass("sap-a-object-inspector-view");
        renderjson.set_show_to_level(2);
    }

    initLayout()
    {
        this.$title = $(`
            <h2 class="title" />
        `);
        this.$content = $(`
            <div class="content" />
        `);
        this.$element.append(this.$title);
        this.$element.append(this.$content);
    }

    setTitle(value)
    {
        this.setProperty("title", value);
        this.$title.text(value);
    }

    setValue(value)
    {
        this.setProperty("value", value);
        const $renderedDOM = $(renderjson(value));
        this.$content.empty();
        this.$content.append($renderedDOM);
    }
}
