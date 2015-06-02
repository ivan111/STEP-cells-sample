def parse_expression():
    lhs = parse_primary()
    return parse_op2_rhs(0, lhs)

def parse_op2_rhs(expr_prec, lhs):
    while True:
        tok_prec = get_tok_Precedence()

        if expr_prec > tok_prec:
            return lhs

        op2 = cur_tok
        get_next_token()

        rhs = parse_primary()

        next_prec = get_tok_precedence()
        if tok_prec < next_prec:
            rhs = parse_op2_rhs(tok_prec + 1, rhs)

        lhs = createOp2AST(op2, lhs, rhs)
