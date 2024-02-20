/**
 * @file Helper functions for generating JavaScript code from canvas calls
 * @author Ryszard Trojnacki
 */

class CodeGenerator {
    constructor() {
        /**
         * Code lines
         * @type {string[]}
         */
        this.lines = [];
        /**
         * Ident to add to every line
         * @type {string}
         */
        this.ident='';
    }

    toCode() {
        return this.lines.join("\n");
    }

    incIdent() {
        this.ident+='    ';
    }

    resolveParameter(p) {
        return JSON.stringify(p);
    }

    decIdent() {
        this.ident=this.ident.substring(0, this.ident.length-4);
    }

    append(line) {
        this.lines.push(this.ident+line);
    }

    func(name, ...params) {
        this.append(`${name}(${params.map(p => this.resolveParameter(p)).join(", ")});`);
    }

    set(variable, value) {
        this.append(`${variable}=${this.resolveParameter(value)};`);
    }
}

module.exports=CodeGenerator;