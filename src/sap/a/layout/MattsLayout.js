import MutipleLayout from "./MutipleLayout";

export default class MattsLayout extends MutipleLayout
{
    attach($element)
    {
        super.attach($element);
        $element.addClass("sap-a-matts-layout");
    }

    getContainerCount()
    {
        return 4;
    }
}
