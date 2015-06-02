(function() {
    "use strict";

    window.opp = {
        init: init
    };


    function init() {
        /* eslint-disable */
        var code = {"defs":{},"code":[[[20,"setup",[]]],[[4,[15,"b"],[20,"nextInput",[]]]],[[0],1,[26,22,4]],[[4,[15,"a"],[20,"getTopTerminal",[[15,"stack"]]]]],[],[[1,[9,[28,[15,"a"],"nodeChar"],"$"],[9,[28,[15,"b"],"nodeChar"],"$"]],[26,7,1]],[[22,22,4]],[[25,22,2],[0],[12,[20,"f",[[15,"a"]]],[20,"g",[[15,"b"]]]],[26,10,1]],[[20,"stackPush",[[15,"b"]]]],[[4,[15,"b"],[20,"nextInput",[]]]],[[25,22,1],[0]],[[4,0,[29,[20,"getAllTerminalPairs",[[15,"stack"]]],"slice",[0]]],[0],[27,[15,"pair"],0],[26,15,4]],[[11,[20,"f",[[28,[15,"pair"],"b1"]]],[20,"g",[[28,[15,"pair"],"b2"]]]],[26,15,1]],[[22,15,4]],[],[[25,15,2],[0],[0],[25,11,1],[0],[4,[15,"handle"],[20,"getHandle",[[15,"stack"],[28,[15,"pair"],"b1I"]]]]],[[4,[15,"nonterminal"],[20,"reduce",[[15,"handle"],[28,[15,"pair"],"b1I"]]]]],[[15,"nonterminal"],[26,19,1]],[[20,"stackPush",[[15,"nonterminal"]]]],[[25,22,0],[0]],[[20,"pause",[]]],[],[[0],[0],[0],[25,2,0],[0]]]};
        /* eslint-enable */

        var js = {
            production: {
                "n": function () { return { nodeChar: "E" }; },
                "(E)": function () { return { nodeChar: "E" }; },
                "E+E": function () { return { nodeChar: "E", op: "+" }; },
                "E-E": function () { return { nodeChar: "E", op: "-" }; },
                "E*E": function () { return { nodeChar: "E", op: "*" }; },
                "E/E": function () { return { nodeChar: "E", op: "/" }; },
                "E^E": function () { return { nodeChar: "E", op: "^" }; }
            },

            fgIndexMap: { "+": 1, "-": 2, "*": 3, "/": 4, "^": 5, "(": 6, ")": 7, "n": 8, "$": 9 },
            fMap: { "+": 2, "-": 2, "*": 4, "/": 4, "^": 5, "(": 0, ")": 11, "n": 11, "$": 0 },
            gMap: { "+": 1, "-": 1, "*": 3, "/": 3, "^": 6, "(": 10, ")": 0, "n": 10, "$": 0 },


            init: function () {
                this.panels.lex.lexButton.onclick();

                this.vars.addChangeVarListener(function (scs, varName, varValue) {
                    if (varName !== "pair") {
                        return;
                    }

                    scs.panels.stackTable.clearClassName();
                    scs.panels.stackTable.setClassName("selected-1", 0, varValue.b1I);
                    scs.panels.stackTable.setClassName("selected-1", 0, varValue.b2I);

                    scs.comment(12, js.createCompStr(scs, varValue.b1, varValue.b2));
                });
            },


            setup: function () {
                var tokens = js.tokens;

                this.vars("input", tokens.slice(0));
                this.vars("bI", -1);
                this.vars("stack", [{ nodeChar: "$", toString: function () { return this.nodeChar; } }]);

                this.panels.lexTable.clearClassName();
                this.panels.stackTable.deleteAll();
                this.panels.stackTable.insertRow(["$"]);
                this.panels.precTable.clearClassName();

                var root = {
                    nodeText: "dummy",
                    children: tokens.slice(0, tokens.length - 1)
                };

                js.vtree.root(root).update();

                this.panels.codeTable.removeAllComments();
            },


            f: function (token) {
                var f = js.fMap;
                return f[token.nodeChar];
            },


            g: function (token) {
                var g = js.gMap;
                return g[token.nodeChar];
            },


            nextInput: function () {
                var input = this.vars("input");
                var b = input.shift();
                this.vars("input", input);
                var bI = this.vars("bI") + 1;
                this.vars("bI", bI);

                this.panels.lexTable.clearClassName();
                this.panels.lexTable.setClassName("selected", 0, bI);

                this.varComment("b", b.nodeChar, "input", js.tokens2str(input));

                if (this.pos[0] === 9) {
                    this.removeComment(1);
                }

                return b;
            },


            stackPush: function (d) {
                var stack = this.vars("stack");
                stack.push(d);
                this.vars("stack", stack);

                this.panels.stackTable.insertColumn([d.nodeChar]);

                this.varComment("stack", js.tokens2str(stack));
                this.removeComment(17);

                if (this.pos[0] === 8) {
                    this.removeComment(18);
                } else {
                    this.removeComment(8);
                }
            },


            getTopTerminal: function (stack) {
                for (var i = stack.length - 1; i >= 0; i--) {
                    var token = stack[i];

                    if (token.nodeChar !== "E") {
                        this.panels.stackTable.clearClassName();
                        this.panels.stackTable.setClassName("selected", 0, i);

                        var a = token;
                        var b = this.vars("b");
                        var aCh = a.nodeChar;
                        var bCh = b.nodeChar;

                        this.varComment("a", aCh);

                        if (aCh === "$" && bCh === "$") {
                            this.comment(5, "True");
                            this.removeComment(7);
                        } else {
                            this.comment(5, "False");
                            this.comment(7, js.createCompStr(this, a, b));
                        }

                        return a;
                    }
                }

                throw "not found terminal symbol in the stack";
            },


            getAllTerminalPairs: function (stack) {
                var result = [];

                for (var i = stack.length - 1; i >= 0; i--) {
                    var right = stack[i];

                    if (right.nodeChar === "E") {
                        continue;
                    }

                    for (var k = i - 1; k >= 0; k--) {
                        var left = stack[k];

                        if (left.nodeChar === "E") {
                            continue;
                        }

                        var item = {};
                        item.b1I = k;
                        item.b1 = left;
                        item.b2I = i;
                        item.b2 = right;

                        result.push(item);
                        break;
                    }
                }

                return result;
            },


            getHandle: function (stack, b1I) {
                var i = b1I + 1;

                var deleteNum = stack.length - i;
                var handle = stack.slice(i);
                this.vars("stack", stack.slice(0, i));

                for (var k = 0; k < deleteNum; k++) {
                    this.panels.stackTable.deleteColumn();
                }
                this.panels.stackTable.clearClassName();

                this.varComment(14, "handle", js.tokens2str(handle));

                return handle;
            },


            reduce: function(handle, b1I) {
                var handleStr = js.tokens2str(handle);
                var eFunc = js.production[handleStr];

                if (!eFunc) {
                    return null;
                }

                var e = eFunc();

                if (e.op) {
                    var leftNum = handle[0].num;
                    var rightNum = handle[2].num;

                    if (e.op === "+") {
                        e.num = leftNum + rightNum;
                    } else if (e.op === "-") {
                        e.num = leftNum - rightNum;
                    } else if (e.op === "*") {
                        e.num = leftNum * rightNum;
                    } else if (e.op === "/") {
                        e.num = leftNum / rightNum;
                    } else if (e.op === "^") {
                        e.num = Math.pow(leftNum, rightNum);
                    }
                } else {
                    if (handle.length === 1) {
                        e.num = handle[0].num;
                    } else {  // (E)
                        e.num = handle[1].num;
                    }
                }

                e.className = "node-type-5";
                e.children = handle;
                e.nodeText = "" + e.num;

                var root = js.vtree.root();

                root.children.splice(b1I, handle.length, e);

                js.vtree.update();

                if (e) {
                    this.comment(17, "True, nonterminal = \"E\"");
                } else {
                    this.comment(17, "False");
                }

                return e;
            },


            createCompStr: function (scs, a, b) {
                var aCh = a.nodeChar;
                var bCh = b.nodeChar;
                var fa = js.f(a);
                var gb = js.g(b);

                if (fa === gb) {
                    var eq = " == ";
                } else if (fa < gb) {
                    eq = " < ";
                } else {
                    eq = " > ";
                }

                if (fa <= gb) {
                    var boolStr = "True";
                } else {
                    boolStr = "False";
                }

                scs.panels.precTable.clearClassName();
                scs.panels.precTable.setClassName("selected-2", 1, js.fgIndexMap[aCh]);
                scs.panels.precTable.setClassName("selected-2", 2, js.fgIndexMap[bCh]);

                return [boolStr, ", f(\"", aCh, "\"): ", fa, eq, "g(\"", bCh, "\"): ", gb].join("");
            },


            tokens2str: function (tokens) {
                var arr = [];

                tokens.forEach(function (token) {
                    arr.push(token.nodeChar);
                });

                return arr.join("");
            }
        };


        var stepCells = new sc.StepCells(code.defs, code.code, js);

        var buttonsContainer = document.getElementById("buttonsContainer");
        var treeContainer = document.getElementById("treeContainer");
        var lexContainer = document.getElementById("lexContainer");
        var codeTable = document.getElementById("codeTable");
        var lexTable = document.getElementById("lex-result");
        var stackTable = document.getElementById("stack");
        var precTable = document.getElementById("prec");
        var message = document.getElementById("message");

        stepCells.panels.buttons = new sc.panels.Buttons(stepCells, { container: buttonsContainer, showRunButton: true });
        stepCells.panels.tree = new sc.panels.Tree(stepCells, { container: treeContainer, width: 380, height: 420 });
        stepCells.panels.lex = new sc.panels.Lex(stepCells, { container: lexContainer });
        stepCells.panels.stackTable = new sc.panels.Table(stepCells, { table: stackTable });
        stepCells.panels.precTable = new sc.panels.Table(stepCells, { table: precTable });
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
