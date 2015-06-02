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
