export class CitySelector {
    constructor(data) {
        this.data = data
    }

    //Remove selection from a city if one was selected
    resetSelection = () => {
        let prev = false;
        if (this.selection) {
            prev = this.selection.highlight;
            this.selection.highlight = false
        }
        return prev;
    }

    setSelection = (d) => {
        this.resetSelection()
        this.selection = d
        d.highlight = true;
    }

    findCity = (cityId) => {
        if (cityId == 0)
            return null;

        var city = null;
        for (let d of this.data) {
            if (d.id == cityId) {
                city = d;
                this.setSelection(d);
                break;
            }
        }
        return city;
    }
}