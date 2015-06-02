b = 先読み記号
while True:
    a = stackで一番トップに近い終端記号

    if a == $ and b == $:
        break  # 受理
    elif f(a) < g(b) or f(a) == g(b):  # シフト
        stack.push(b)
        入力(b)を１つ進める
    else:  # f(a) > g(b)    還元
        for pair in stackの右側から順に２つの終端記号を取得:
            if f(pair.b1) < g(pair.b2):
                break

        handle = stackのpair.b1の１つ上からトップまで
        nonterminal = handleにマッチする生成規則を探す
        if nonterminal:
            stack.push(nonterminal)
        else:
            throw エラー
