/**
 * @file Helper functions for generating JavaScript code from canvas calls
 * @author Ryszard Trojnacki
 */

class CodeGenerator {
    constructor() {
        this.code = [];
        this.ident='';
    }

    toCode() {
        return this.code.join("\n");
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
        this.code.push(this.ident+line);
    }

    func(name, ...params) {
        this.append(`${name}(${params.map(p => this.resolveParameter(p)).join(", ")});`);
    }

    set(variable, value) {
        this.append(`${variable}=${this.resolveParameter(value)};`);
    }
}

module.exports=CodeGenerator;