(function() {
    "use strict";

    window.op2 = {
        init: init
    };


    function init() {
        /* eslint-disable */
        var code = {"defs":{"parse_op2_rhs":{"params":["expr_prec","lhs"],"pos":[5,1]}},"code":[[[20,"setup",[]]],[],[[4,[15,"lhs"],[20,"parse_primary",[]]]],[[19,"parse_op2_rhs",[0,[15,"lhs"]]]],[],[[25,23,3],[0]],[[0],1,[26,23,1]],[[4,[15,"tok_prec"],[20,"get_tok_precedence",[]]]],[],[[13,[15,"expr_prec"],[15,"tok_prec"]],[26,12,1]],[[20,"clearAllComments",[]],[21,[15,"lhs"]]],[],[[25,12,2],[0],[0],[4,[15,"op2"],[20,"get_cur_token",[]]]],[[20,"get_next_token",[]]],[],[[4,[15,"rhs"],[20,"parse_primary",[]]]],[],[[4,[15,"next_prec"],[20,"get_tok_precedence",[]]]],[[11,[15,"tok_prec"],[15,"next_prec"]],[26,21,1]],[[19,"parse_op2_rhs",[[5,[15,"tok_prec"],1],[15,"rhs"]]],[4,[15,"rhs"],[24]]],[],[[25,21,2],[0],[0],[4,[15,"lhs"],[20,"create_op2_ast",[[15,"op2"],[15,"lhs"],[15,"rhs"]]]]],[],[[25,6,0],[0],[30,[21]],[0]]]};
        /* eslint-enable */

        var js = {
            init: function () {
                js.parser = new Parser();
                this.panels.lex.lexButton.onclick();
                var scs = this;
                js.parser.addChangeIndexListener(function (p, i) {
                    scs.panels.lexTable.clearClassName();
                    scs.panels.lexTable.setClassName("selected", 0, i);
                });

                this.vars.addChangeVarListener(function (s, varName, varValue) {
                    switch (varName) {
                        case "tok_prec":
                            s.varComment("tok_prec", varValue);
                            s.comment(9, js.createCompStr(s.vars("expr_prec"), ">", varValue));
                            s.removeComment(12);
                            s.removeComment(17);
                            s.removeComment(18);
                            break;

                        case "next_prec":
                            s.varComment("next_prec", varValue);
                            s.comment(18, js.createCompStr(s.vars("tok_prec"), "<", varValue));
                            break;

                        case "op2":
                            s.varComment("op2", varValue.nodeChar);
                            break;
                    }
                });
            },

            setup: function () {
                js.parser.setTokens(js.tokens);
                js.root = { nodeText: "dummy" };
                js.vtree.root(js.root).update();
                this.panels.codeTable.removeAllComments();
            },

            parse_primary: function () {
                var ast = js.parser.parsePrimary();
                js.appendChild(ast);
                return ast;
            },

            get_tok_precedence: function () {
                return js.parser.getPrecedence();
            },

            get_cur_token: function () {
                return js.parser.token;
            },

            get_next_token: function () {
                js.parser.nextToken();
            },

            create_op2_ast: function (op, lhs, rhs) {
                var node = js.parser.createOp2AST(op, lhs, rhs);

                js.appendOp2Child(node, lhs, rhs);

                return node;
            },

            createCompStr: function (p1, kigo, p2) {
                if (kigo === ">") {
                    if (p1 > p2) {
                        var boolStr = "True, ";
                    } else {
                        boolStr = "False, ";
                    }
                } else {
                    if (p1 < p2) {
                        boolStr = "True, ";
                    } else {
                        boolStr = "False, ";
                    }
                }

                if (p1 === p2) {
                    var eq = " == ";
                } else if (p1 < p2) {
                    eq = " < ";
                } else {
                    eq = " > ";
                }

                return [boolStr, p1, eq, p2].join("");
            },

            appendChild: function (child) {
                if (!js.root.children) {
                    js.root.children = [];
                }

                js.root.children.push(child);

                js.vtree.update();
            },

            appendOp2Child: function (op, lhs, rhs) {
                if (!js.root.children) {
                    js.root.children = [];
                }

                js.root.children.push(op);

                js.removeChild(lhs);
                js.removeChild(rhs);

                js.vtree.update();
            },


            removeChild: function (child) {
                if (!js.root.children) {
                    return;
                }

                var i = js.root.children.indexOf(child);

                if (i === -1) {
                    return;
                }

                js.root.children.splice(i, 1);
            },

            clearAllComments: function () {
                this.panels.codeTable.removeAllComments();
            }
        };


        var stepCells = new sc.StepCells(code.defs, code.code, js);

        var treeContainer = document.getElementById("treeContainer");
        var buttonsContainer = document.getElementById("buttonsContainer");
        var lexTable = document.getElementById("lexTable");
        var lexContainer = document.getElementById("lexContainer");
        var codeTable = document.getElementsByClassName("highlighttable")[0];
        var message = document.getElementById("message");

        stepCells.panels.buttons = new sc.panels.Buttons(stepCells, { container: buttonsContainer, showRunButton: true });
        stepCells.panels.lexTable = new sc.panels.Table(stepCells, { table: lexTable });
        stepCells.panels.lex = new sc.panels.Lex(stepCells, { container: lexContainer });
        stepCells.panels.tree = new sc.panels.Tree(stepCells, { container: treeContainer, width: 370, height: 440 });
        stepCells.panels.codeTable = new sc.panels.CodeTable(stepCells, { codeTable: codeTable });

        stepCells.addErrorListener(function (scs, e) {
            message.innerHTML = e;
        });

        if (js.init) {
            js.init.call(stepCells);
        }

        stepCells.reset();
    }
})();
