class Formatter {

    constructor(input) {
        this.input = input;
    }

    maskInput(maskWith) {
        let result;
        let mask = !maskWith ? "*" : maskWith;

        if (typeof this.input === 'string' || this.input instanceof String) {
            result = this.input.replace(/[a-zA-Z0-9+()]/g, mask);
        } else {

            throw new Error("input is not a valid String");
        }
        return result;

    }

    maskLastdigits(maskWith, numberOfLastDigits) {
        let result;
        let untouched;
        let mask = !maskWith ? "*" : maskWith;
        let digits = !numberOfLastDigits ? 0:numberOfLastDigits;

        if (typeof this.input === 'string' || this.input instanceof String) {
            untouched = this.input.slice(this.input.length - digits, this.input.length);
            let touched = this.input.slice(0, this.input.length - digits);
            result = touched.replace(/[a-zA-Z0-9+()]/g, mask);
        } else {

            throw new Error("input is not a valid String");
        }
        return `${result} ${untouched}`;

    }


}

//Sample
//const u = new Formatter("05536843029").maskInput('*');
//const q = new Formatter("05536843029").maskLastdigits('*',4);