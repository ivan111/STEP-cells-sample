(function() {
    "use strict";

    sc.panels.Lex = Lex;


    function Lex(stepCells, conf) {
        createLexPanel(this, stepCells, conf);
    }


    function createLexPanel(thisObj, stepCells, conf) {
        var panel = conf.container;
        helpers.addClass(panel, "sc-lex-panel");

        panel.innerHTML = "ソースコード：<input class='sc-lex-src' type='text' value='(3 + 4) * 2' style='width: 16em;' />" +
            "<input class='sc-lex-button' type='button' value='字句解析' /><div class='sc-lex-message'></div>";

        var lexSrc = panel.getElementsByClassName("sc-lex-src")[0];
        var msg = panel.getElementsByClassName("sc-lex-message")[0];

        thisObj.lexButton = panel.getElementsByClassName("sc-lex-button")[0];
        thisObj.lexButton.onclick = function () {
            try {
                var tokens = lex(lexSrc.value);
            } catch (e) {
                tokens = [{ nodeChar: "$", className: "node-type-5", toString: tokenToString }];
                msg.innerHTML = e;
            }

            stepCells.js.tokens = tokens;
            stepCells.reset();

            var data = [];
            tokens.forEach(function (token) {
                data.push(token.nodeChar);
            });
            stepCells.panels.lexTable.deleteAll();
            stepCells.panels.lexTable.insertRow(data);
        };
    }


    var RE_SPACE = /^([ \t]+)/;
    var RE_NUM = /^(\d+)/;
    var RE_CHAR = /^([\+\-\*\/\(\)^])/;

    function lex(src) {
        var i = 0;
        var tokens = [];

        for (;;) {
            if (i >= src.length) {
                tokens.push({ nodeChar: "$", className: "node-type-5", toString: tokenToString });
                break;
            }

            var s = src.substr(i);
            var m = RE_SPACE.exec(s);

            if (m) {
                i += m[1].length;
                s = src.substr(i);
            }

            m = RE_CHAR.exec(s);

            if (m) {
                var no = 0;

                if (m[1] === "(" || m[1] === ")") {
                    no = 3;
                } else if (m[1] === "+" || m[1] === "-") {
                    no = 4;
                } else if (m[1] === "*" || m[1] === "/") {
                    no = 2;
                }

                tokens.push({ nodeChar: m[1], className: "node-type-" + no, toString: tokenToString });
                i += m[1].length;
                continue;
            }

            m = RE_NUM.exec(s);

            if (m) {
                var num = parseInt(m[1]);
                tokens.push({ nodeChar: "n", className: "node-type-1", nodeText: "" + num, num: num, toString: tokenToString });
                i += m[1].length;
                continue;
            }

            throw ["(pos ", i + 1, ") unknown token: " + s[0]].join("");
        }

        return tokens;
    }


    function tokenToString() {
        return this.nodeChar;
    }
})();
