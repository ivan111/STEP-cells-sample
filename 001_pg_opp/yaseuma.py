b = input.shift()
while 1:
    a = getTopTerminal(stack)

    if a.nodeChar == '$' and b.nodeChar == '$':
        break
    elif f(a) < g(b) or f(a) == g(b):
        stack.push(b)
        b = input.shift()
    else:
        for pair in getAllTerminalPairs(stack):
            if f(pair.b1) < g(pair.b2):
                break

        handle = getHandle(stack, pair.b1_i)
        nonterminal = reduce(handle, pair.b1_i)
        if nonterminal:
            stack.push(nonterminal)
        else:
            pause()
