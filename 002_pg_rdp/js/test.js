(function() {
    "use strict";

    window.rdp = {
        init: init,
        compile: compile
    };


    
        var callTreeContainer;
        
        var varsTableContainer;
        var asmTableContainer;
        
        var buttonsContainer;
        var lexContainer;

    var buttonsContainer2;

    var codeTable;


    function init() {
        
            callTreeContainer = document.getElementById("callTreeContainer");
            
            varsTableContainer = document.getElementById("varsTableContainer");
            asmTableContainer = document.getElementById("asmTableContainer");
            
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


            var stepCells = new sc.StepCells(code.defs, code.code, js);

            
                callTreeContainer.innerHTML = "";
            stepCells.panels.callTree = new sc.panels.CallTree(stepCells, { container: callTreeContainer, width: 960, height: 300, userNodeChar: true });
                
                varsTableContainer.innerHTML = "";
            stepCells.panels.varsTable = new sc.panels.VarsTable(stepCells, { container: varsTableContainer, minNumRows: 6 });
                asmTableContainer.innerHTML = "";
            stepCells.panels.asmTable = new sc.panels.AsmTable(stepCells, { container: asmTableContainer, html: html });
                
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
