(function() {
    "use strict";

    window.Parser = Parser;


    // class Parser
    function Parser() {
        helpers.createEvent(this, "ChangeIndex");
    }


    Parser.prototype.setTokens = function (tokens) {
        this.tokens = tokens;

        this.reset();
    };


    Parser.prototype.reset = function () {
        this.i = -1;
        this.nextToken();
    };


    Parser.prototype.parse = function () {
        return this.parseExpression();
    };


    var EOF = { nodeChar: "$" };


    Parser.prototype.nextToken = function () {
        if (this.tokens && this.i + 1 < this.tokens.length) {
            this.i++;
            this.token = this.tokens[this.i];
            this.notifyChangeIndex(this, this.i);
            return;
        }

        this.token = EOF;
    };


    // -----------------------------------------------------------------------
    // Expression
    // -----------------------------------------------------------------------

    var precedence = {
        "+": 20,
        "-": 20,
        "*": 40,
        "/": 40
    };


    Parser.prototype.parseExpression = function () {
        var lhs = this.parsePrimary();

        return this.parseOp2RHS(0, lhs);
    };


    Parser.prototype.parseOp2RHS = function (leftPrec, lhs) {
        for (;;) {
            var rightPrec = this.getPrecedence();

            if (rightPrec < leftPrec) {
                return lhs;
            }

            var op = this.token;

            this.nextToken();

            var rhs = this.parsePrimary();

            var nextPrec = this.getPrecedence();

            if (rightPrec < nextPrec) {
                rhs = this.parseOp2RHS(rightPrec + 1, rhs);
            }

            return this.createOp2AST(op, lhs, rhs);
        }
    };


    Parser.prototype.createOp2AST = function (op, lhs, rhs) {
        var node = {
            nodeChar: op.nodeChar,
            children: [lhs, rhs]
        };

        node.className = op.className;

        return node;
    };


    Parser.prototype.getPrecedence = function () {
        var s = this.token.nodeChar;

        if (s in precedence) {
            return precedence[s];
        }

        return -1;
    };


    // -----------------------------------------------------------------------
    // Primary
    // -----------------------------------------------------------------------

    Parser.prototype.parsePrimary = function () {
        switch (this.token.nodeChar) {
            case "V":
                return this.parseID();

            case "n":
                return this.parseNumber();

            case "(":
                return this.parseParen();

            default:
                throw "こんなトークンが来るとは思ってませんでした: " + this.token.nodeChar;
        }
    };


    Parser.prototype.parseNumber = function () {
        var token = this.token;

        this.nextToken();

        return token;
    };


    Parser.prototype.parseParen = function () {
        this.nextToken();

        var ast = this.parseExpression();

        if (this.token.nodeChar !== ")") {
            throw "閉じカッコ ')' が抜けています。";
        }

        this.nextToken();

        return ast;
    };


    Parser.prototype.parseID = function () {
        var token = this.token;

        this.nextToken();

        return token;
    };
})();
