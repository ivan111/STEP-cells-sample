(function() {
    "use strict";

    window.{{ settings.name }} = {
        init: init,
        compile: compile
    };


    {% for panel in settings.panels %}
        {% if settings.panels[panel].use -%}
    var {{ panel }}Container;
        {%- endif %}
    {%- endfor %}

    var buttonsContainer2;

    var codeTable;


    function init() {
        {% for panel in settings.panels %}
            {% if settings.panels[panel].use -%}
        {{ panel }}Container = document.getElementById("{{ panel }}Container");
            {%- endif %}
        {%- endfor %}

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

            {{ js }}

            var stepCells = new sc.StepCells(code.defs, code.code, js);

            {% for panel in settings.panels %}
                {% if settings.panels[panel].use -%}
            {{ panel }}Container.innerHTML = "";
            stepCells.panels.{{ settings.panels[panel].varName }} = new sc.panels.{{ settings.panels[panel].name }}(stepCells, {{ settings.panels[panel].conf }});
                {%- endif %}
            {%- endfor %}

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

