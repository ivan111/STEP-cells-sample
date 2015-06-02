(function() {
    "use strict";

    window.rdp = {
        init: init
    };


    function init() {
        /* eslint-disable */
        var code = {"defs":{"E":{"params":[],"pos":[5,4]},"T":{"params":[],"pos":[11,5]},"F":{"params":[],"pos":[17,5]}},"code":[[[20,"setup",[]]],[[19,"E",[]]],[[10,[28,[15,"token"],"nodeChar"],"$"],[26,5,1]],[[20,"pause",[]]],[],[[25,5,2],[0],[0],[25,11,3],[0]],[[19,"T",[]],[4,0,[24]],[4,[15,"num"],[15,0]]],[[0],[2,[9,[28,[15,"token"],"nodeChar"],"+"],[9,[28,[15,"token"],"nodeChar"],"-"]],[26,11,1]],[[20,"node",[]],[4,[15,"op"],[28,[15,"token"],"nodeChar"]],[20,"getToken",[]]],[[19,"T",[]],[4,1,[24]],[4,[15,"right"],[15,1]],[4,[15,"num"],[20,"calc",[[15,"op"],[15,"num"],[15,"right"]]]]],[],[[25,7,0],[0],[30,[21, [15, "num"]]],[0],[25,17,3],[0]],[[19,"F",[]],[4,0,[24]],[4,[15,"num"],[15,0]]],[[0],[2,[9,[28,[15,"token"],"nodeChar"],"*"],[9,[28,[15,"token"],"nodeChar"],"/"]],[26,17,1]],[[20,"node",[]],[4,[15,"op"],[28,[15,"token"],"nodeChar"]],[20,"getToken",[]]],[[19,"F",[]],[4,1,[24]],[4,[15,"right"],[15,1]],[4,[15,"num"],[20,"calc",[[15,"op"],[15,"num"],[15,"right"]]]]],[],[[25,13,0],[0],[30,[21, [15, "num"]]],[0],[25,29,3],[0]],[[9,[28,[15,"token"],"nodeChar"],"("],[26,24,1]],[[20,"node",[]],[20,"getToken",[]]],[[19,"E",[]],[4,[15,"num"],[24]]],[[10,[28,[15,"token"],"nodeChar"],")"],[26,23,1]],[[20,"pause",[]]],[[25,23,2],[0],[0],[20,"node",[]],[20,"getToken",[]],[21,[15,"num"]]],[[25,29,1],[0],[9,[28,[15,"token"],"nodeChar"],"n"],[26,26,1]],[[20,"node",[]],[4,[15,"num"],[28,[15,"token"],"num"]],[20,"getToken",[]],[21,[15,"num"]]],[[25,29,0],[0]],[[20,"pause",[]]],[],[[0],[0],[30,[21]],[0]]]};
        /* eslint-enable */

        var js = {
            init: function () {
                this.panels.lex.lexButton.onclick();
            },

            setup: function () {
                js.input = js.tokens.slice(0);
                js.i = 0;
                js.token = js.input.shift();

                this.panels.lexTable.clearClassName();
                this.panels.lexTable.setClassName("selected", 0, js.i);
            },

            getToken: function () {
                js.token = js.input.shift();
                js.i++;

                this.panels.lexTable.clearClassName();
                this.panels.lexTable.setClassName("selected", 0, js.i);
            },

            node: function () {
                js.appendCallTreeChild(js.token);
            },

            createNode: function (funcName) {
                return { nodeChar: funcName };
            },

            calc: function (op, left, right) {
                switch (op) {
                    case "+": return left + right;
                    case "-": return left - right;
                    case "*": return left * right;
                    case "/": return left / right;
                    default: throw "unknown op: " + op;
                }
            }
        };


        var stepCells = new sc.StepCells(code.defs, code.code, js);

        var callTreeContainer = document.getElementById("callTreeContainer");
        var buttonsContainer = document.getElementById("buttonsContainer");
        var lexContainer = document.getElementById("lexContainer");
        var lexTable = document.getElementById("lex-result");
        var codeTable = document.getElementsByClassName("highlighttable")[0];
        var message = document.getElementById("message");

        stepCells.panels.callTree = new sc.panels.CallTree(stepCells, { container: callTreeContainer, width: 470, height: 540, useNodeChar: true, showReturnValue: true });
        stepCells.panels.buttons = new sc.panels.Buttons(stepCells, { container: buttonsContainer, showRunButton: true });
        stepCells.panels.lex = new sc.panels.Lex(stepCells, { container: lexContainer });
        stepCells.panels.codeTable = new sc.panels.CodeTable(stepCells, { codeTable: codeTable });
        stepCells.panels.lexTable = new sc.panels.Table(stepCells, { table: lexTable });

        stepCells.addErrorListener(function (scs, e) {
            message.innerHTML = e;
        });

        if (js.init) {
            js.init.call(stepCells);
        }

        stepCells.reset();
    }
})();
