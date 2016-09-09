import Layout from "./Layout";

export default class FlowLayout extends Layout
{
    append($child)
    {
        this.$element.append($child);
    }
}
