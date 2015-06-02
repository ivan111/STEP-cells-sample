var js = {
    tokens: ["+", "n", "*", "n", "$"],

    setup: function () {
        js.input = js.tokens.slice(0);
        js.token = "n";
        //this.vars("input", ["+", "n", "*", "n", "$"]);
        //this.vars("token", "n");
    },

    getToken: function () {
        //var input = this.vars("input");
        js.token = js.input.shift();
        //var token = input.shift();

        //this.vars.global("input", input);
        //this.vars.global("token", token);
    },

    node: function () {
        //js.appendCallTreeChild({ nodeChar: this.vars("token") });
        js.appendCallTreeChild({ nodeChar: js.token });
    },

    createNode: function (funcName) {
        return { nodeChar: funcName };
    }
};
