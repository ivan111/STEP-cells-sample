(function() {
    "use strict";

    window.sample = {
        init: init,
        compile: compile
    };


    
        var callTreeContainer;
        var consoleContainer;
        var varsTableContainer;
        var asmTableContainer;
        var treeContainer;
        var buttonsContainer;

    var buttonsContainer2;

    var codeTable;


    function init() {
        
            callTreeContainer = document.getElementById("callTreeContainer");
            consoleContainer = document.getElementById("consoleContainer");
            varsTableContainer = document.getElementById("varsTableContainer");
            asmTableContainer = document.getElementById("asmTableContainer");
            treeContainer = document.getElementById("treeContainer");
            buttonsContainer = document.getElementById("buttonsContainer");

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

            var js = {};


            var stepCells = new sc.StepCells(code.defs, code.code, js);

            
                callTreeContainer.innerHTML = "";
            stepCells.panels.callTree = new sc.panels.CallTree(stepCells, { container: callTreeContainer, width: 960, height: 300 });
                consoleContainer.innerHTML = "";
            stepCells.panels.console = new sc.panels.Console(stepCells, { container: consoleContainer });
                varsTableContainer.innerHTML = "";
            stepCells.panels.varsTable = new sc.panels.VarsTable(stepCells, { container: varsTableContainer, minNumRows: 6 });
                asmTableContainer.innerHTML = "";
            stepCells.panels.asmTable = new sc.panels.AsmTable(stepCells, { container: asmTableContainer, html: html });
                treeContainer.innerHTML = "";
            stepCells.panels.tree = new sc.panels.Tree(stepCells, { container: treeContainer, width: 960, height: 300 });
                buttonsContainer.innerHTML = "";
            stepCells.panels.buttons = new sc.panels.Buttons(stepCells, { container: buttonsContainer, showRunButton: true });

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
