import codecs
import sys

from pygments.formatters import HtmlFormatter
from pygments import highlight
from pygments.lexers import get_lexer_by_name


def main(src, lang, html_name):
    lexer = get_lexer_by_name(lang, stripall=True)
    formatter = MyHtmlFormatter(linenos='table')
    result = highlight(src, lexer, formatter)

    f = codecs.open(html_name, 'wb', 'utf-8')
    f.write(result)
    f.close()


line_template = '  <tr><td class="linenos">%d</td><td class="code">%s</td></tr>\n'


class MyHtmlFormatter(HtmlFormatter):
    def _wrap_tablelinenos(self, inner):
        code = []
        lncount = 0
        for t, line in inner:
            if t:
                lncount += 1
                code.append(line.rstrip())

        fl = self.linenostart

        yield 0, ('<table class="%stable highlight">\n' % self.cssclass)

        for i in range(fl, fl+lncount):
            if code[i - 1] == '':
                yield 0, line_template % (i, '')
            else:
                yield 0, line_template % (i, '<pre>' + code[i - 1] + '</pre>')

        yield 0, '</table>'


if __name__ == '__main__':
    src = codecs.open(sys.argv[1], 'r', 'utf-8').read()
    main(src, sys.argv[2], sys.argv[3])
