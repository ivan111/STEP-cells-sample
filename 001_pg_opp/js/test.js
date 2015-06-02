(function() {
    "use strict";

    window.sample = {
        init: init,
        compile: compile
    };


    
        
        
        var varsTableContainer;
        var asmTableContainer;
        var treeContainer;
        var buttonsContainer;
        var lexContainer;

    var buttonsContainer2;

    var codeTable;


    function init() {
        
            
            
            varsTableContainer = document.getElementById("varsTableContainer");
            asmTableContainer = document.getElementById("asmTableContainer");
            treeContainer = document.getElementById("treeContainer");
            buttonsContainer = document.getElementById("buttonsContainer");
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
    production: {
        "n": function () { return { nodeChar: "E" }; },
        "(E)": function () { return { nodeChar: "E" }; },
        "E+E": function () { return { nodeChar: "E", op: "+" }; },
        "E-E": function () { return { nodeChar: "E", op: "-" }; },
        "E*E": function () { return { nodeChar: "E", op: "*" }; },
        "E/E": function () { return { nodeChar: "E", op: "/" }; },
        "E^E": function () { return { nodeChar: "E", op: "^" }; }
    },

    fMap: { "+": 2, "-": 2, "*": 4, "/": 4, "^": 5, "(": 0, ")": 11, "n": 11, "$": 0 },
    gMap: { "+": 1, "-": 1, "*": 3, "/": 3, "^": 6, "(": 10, ")": 0, "n": 10, "$": 0 },

    tokens: [{ nodeChar: "$", className: "sc-call-tree-child-node", toString: function () { return this.nodeChar; } }],


    setup: function () {
        var tokens = js.tokens;

        this.vars("input", tokens);
        this.vars("stack", [{ nodeChar: "$", toString: function () { return this.nodeChar; } }]);

        var root = {
            nodeText: "dummy",
            children: tokens.slice(0, tokens.length - 1)
        };

        this.js.vtree.root(root).update();
    },


    f: function (token) {
        var f = this.js.fMap;
        return f[token.nodeChar];
    },


    g: function (token) {
        var g = this.js.gMap;
        return g[token.nodeChar];
    },


    getTopTerminal: function (stack) {
        for (var i = stack.length - 1; i >= 0; i--) {
            var token = stack[i];

            if (token.nodeChar !== "E") {
                return token;
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

        var handle = stack.slice(i);
        this.vars("stack", stack.slice(0, i));

        return handle;
    },


    reduce: function(handle, b1I) {
        var arr = [];
        handle.forEach(function (token) {
            arr.push(token.nodeChar);
        });

        var eFunc = this.js.production[arr.join("")];

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

        e.className = "sc-call-tree-node";
        e.children = handle;
        e.nodeText = "" + e.num;

        var vtree = this.js.vtree;
        var root = vtree.root();

        root.children.splice(b1I, handle.length, e);

        vtree.update();

        return e;
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
