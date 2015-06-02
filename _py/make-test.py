import codecs
import json
import sys

from jinja2 import Template


def make(settings, js_template_str, html_template_str, src, js, code_table,
         js_name, html_name):
    js_files = get_js_files(settings)

    template_values = {
        'js_files': js_files,
        'settings': settings,
        'src': src,
        'js': js,
        'code_table': code_table
    }

    f = codecs.open(js_name, 'wb', 'utf-8')
    js_template = Template(js_template_str)
    f.write(js_template.render(template_values))

    f = codecs.open(html_name, 'wb', 'utf-8')
    html_template = Template(html_template_str)
    f.write(html_template.render(template_values))


def get_js_files(settings):
    js_files = []

    js_files.append('../../vtree2/js/d3.js')
    js_files.append('../../vtree2/js/vtree.js')

    js_files.append('../../yaseuma/js/helpers.js')
    js_files.append('../../yaseuma/js/lex.js')
    js_files.append('../../yaseuma/js/ast.js')
    js_files.append('../../yaseuma/js/exec.js')
    js_files.append('../../yaseuma/js/generate.js')
    js_files.append('../../yaseuma/js/parser/parser.js')
    js_files.append('../../yaseuma/js/parser/parser.statement.js')
    js_files.append('../../yaseuma/js/parser/parser.expression.js')
    js_files.append('../../yaseuma/js/parser/parser.primary.js')
    js_files.append('../../yaseuma/js/code-environment.js')
    js_files.append('../../yaseuma/js/assembler.js')

    js_files.append('../../STEP-cells/js/step-cells.js')
    js_files.append('../../STEP-cells/js/step-cells.exec.js')
    js_files.append('../../STEP-cells/js/vars.js')
    js_files.append('../../STEP-cells/js/panel-buttons.js')
    js_files.append('../../STEP-cells/js/panel-vars.js')
    js_files.append('../../STEP-cells/js/panel-console.js')
    js_files.append('../../STEP-cells/js/panel-code.js')
    js_files.append('../../STEP-cells/js/panel-asm.js')
    js_files.append('../../STEP-cells/js/panel-tree.js')
    js_files.append('../../STEP-cells/js/panel-call-tree.js')
    js_files.append('../../STEP-cells/js/panel-table.js')
    js_files.append('js/test.js')

    return js_files


if __name__ == '__main__':
    settings = json.load(open('settings.json'))
    js_template_str = codecs.open('../_template/test.js', 'r', 'utf-8').read()
    html_template_str = codecs.open('../_template/test.html', 'r', 'utf-8').read()
    src = codecs.open(sys.argv[1], 'r', 'utf-8').read()
    js = codecs.open(sys.argv[2], 'r', 'utf-8').read()
    code_table = codecs.open(sys.argv[3], 'r', 'utf-8').read()
    js_name = sys.argv[4]
    html_name = sys.argv[5]

    make(settings, js_template_str, html_template_str, src, js,
         code_table, js_name, html_name)
