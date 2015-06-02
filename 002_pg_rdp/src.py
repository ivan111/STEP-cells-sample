E()
if token != '$':
    raise Exception('ERROR')

def E():
    T()
    while token in ['+', '-']:
        getToken()
        T()

def T():
    F()
    while token in ['*', '/']:
        getToken()
        F()

def F():
    if token == '(':
        getToken()
        E()
        if token != ')':
            raise Exception('ERROR')
        getToken()
    elif token == 'n':
        getToken()
    else:
        raise Exception('ERROR')
