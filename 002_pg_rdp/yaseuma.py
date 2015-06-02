E()
if token != '$':
    pause()

def E():
    T()
    while token == '+' or token == '-':
        node(); getToken()
        T()

def T():
    F()
    while token == '*' or token == '/':
        node(); getToken()
        F()

def F():
    if token == '(':
        node(); getToken()
        E()
        if token != ')':
            pause()
        node(); getToken()
    elif token == 'n':
        node(); getToken()
    else:
        pause()
