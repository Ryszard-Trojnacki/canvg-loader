/**
 * @file Helper functions for generating JavaScript code from canvas calls
 * @author Ryszard Trojnacki
 */

class CodeGenerator {
    constructor() {
        this.code = [];
    }

    toCode() {
        return this.code.join("\n");
    }

    append(line) {
        this.code.push(line);
    }

    func(name, ...params) {
        this.append(`${name}(${params.map(p => JSON.stringify(p)).join(", ")})`);
    }
}

module.exports=CodeGenerator;