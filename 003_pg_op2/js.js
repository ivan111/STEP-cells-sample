var js = {
    init: function () {
        js.parser = new Parser();
        this.panels.lex.lexButton.onclick();
    },

    setup: function () {
        js.parser.setTokens(js.tokens);
    },

    parse_primary: function () {
        js.parser.parsePrimary();
    }
};
