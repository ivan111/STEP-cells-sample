(function() {
    "use strict";

    window.op2 = {
        init: init,
        compile: compile
    };


    var varsTableContainer;
    var asmTableContainer;
    var treeContainer;
    var buttonsContainer;
    var lexTable;
    var lexContainer;

    var buttonsContainer2;

    var codeTable;


    function init() {
        varsTableContainer = document.getElementById("varsTableContainer");
        asmTableContainer = document.getElementById("asmTableContainer");
        treeContainer = document.getElementById("treeContainer");
        buttonsContainer = document.getElementById("buttonsContainer");
        lexTable = document.getElementById("lexTable");
        lexContainer = document.getElementById("lexContainer");

        buttonsContainer2 = document.getElementById("buttonsContainer2");

        codeTable = document.getElementsByClassName("highlighttable")[0];
    }


    function compile() {
        var message = document.getElementById("message");
        message.innerHTML = "";

        try {
            var src = document.getElementById("src").value;
            var code = y.generate(src);

            var html = code.toHTMLTable();

            y.assemble(code);

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
                                s.varComment("tok_prec", s.vars("tok_prec"));
                                s.comment(9, js.createCompStr(s.vars("expr_prec"), ">", s.vars("tok_prec")));
                                s.removeComment(12);
                                s.removeComment(17);
                                s.removeComment(18);
                                break;

                            case "next_prec":
                                s.varComment("next_prec", s.vars("next_prec"));
                                s.comment(18, js.createCompStr(s.vars("tok_prec"), "<", s.vars("next_prec")));
                                break;

                            case "op2":
                                s.varComment("op2", s.vars("op2").nodeChar);
                                break;
                        }
                    });
                },

                setup: function () {
                    js.parser.setTokens(js.tokens);
                    js.root = { nodeText: "dummy" };
                    js.vtree.root(js.root).update();
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
                }
            };


            var stepCells = new sc.StepCells(code.defs, code.code, js);

            varsTableContainer.innerHTML = "";
            stepCells.panels.varsTable = new sc.panels.VarsTable(stepCells, { container: varsTableContainer, minNumRows: 6 });
            asmTableContainer.innerHTML = "";
            stepCells.panels.asmTable = new sc.panels.AsmTable(stepCells, { container: asmTableContainer, html: html });
            treeContainer.innerHTML = "";
            stepCells.panels.tree = new sc.panels.Tree(stepCells, { container: treeContainer, width: 960, height: 300 });
            buttonsContainer.innerHTML = "";
            stepCells.panels.buttons = new sc.panels.Buttons(stepCells, { container: buttonsContainer, showRunButton: true });
            lexTable.innerHTML = "";
            stepCells.panels.lexTable = new sc.panels.Table(stepCells, { table: lexTable });
            lexContainer.innerHTML = "";
            stepCells.panels.lex = new sc.panels.Lex(stepCells, { container: lexContainer });

            buttonsContainer2.innerHTML = "";
            stepCells.panels.buttons2 = new sc.panels.Buttons(stepCells, { container: buttonsContainer2, showRunButton: true });

            stepCells.panels.codeTable = new sc.panels.CodeTable(stepCells, { codeTable: codeTable });

            stepCells.addErrorListener(function (scs, e) {
                message.innerHTML = e;
            });

            if (js.init) {
                js.init.call(stepCells);
            }

            stepCells.reset();

            var dest = document.getElementById("dest");
            dest.value = code.toJSON();
        } catch (e) {
            message.innerHTML = e;
        }
    }
})();
