var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}
  , Prism = function(o) {
    var e, n, u = /\blang(?:uage)?-([\w-]+)\b/i, a = 0, T = {
        manual: o.Prism && o.Prism.manual,
        disableWorkerMessageHandler: o.Prism && o.Prism.disableWorkerMessageHandler,
        util: {
            encode: function e(n) {
                return n instanceof D ? new D(n.type,e(n.content),n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
            },
            type: function(e) {
                return Object.prototype.toString.call(e).slice(8, -1)
            },
            objId: function(e) {
                return e.__id || Object.defineProperty(e, "__id", {
                    value: ++a
                }),
                e.__id
            },
            clone: function a(e, t) {
                var r, n;
                switch (t = t || {},
                T.util.type(e)) {
                case "Object":
                    if (n = T.util.objId(e),
                    t[n])
                        return t[n];
                    for (var s in r = {},
                    t[n] = r,
                    e)
                        e.hasOwnProperty(s) && (r[s] = a(e[s], t));
                    return r;
                case "Array":
                    return n = T.util.objId(e),
                    t[n] || (r = [],
                    t[n] = r,
                    e.forEach(function(e, n) {
                        r[n] = a(e, t)
                    }),
                    r);
                default:
                    return e
                }
            },
            getLanguage: function(e) {
                for (; e && !u.test(e.className); )
                    e = e.parentElement;
                return e ? (e.className.match(u) || [, "none"])[1].toLowerCase() : "none"
            },
            currentScript: function() {
                if ("undefined" == typeof document)
                    return null;
                if ("currentScript"in document)
                    return document.currentScript;
                try {
                    throw new Error
                } catch (e) {
                    var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];
                    if (n) {
                        var a, t = document.getElementsByTagName("script");
                        for (a in t)
                            if (t[a].src == n)
                                return t[a]
                    }
                    return null
                }
            },
            isActive: function(e, n, a) {
                for (var t = "no-" + n; e; ) {
                    var r = e.classList;
                    if (r.contains(n))
                        return !0;
                    if (r.contains(t))
                        return !1;
                    e = e.parentElement
                }
                return !!a
            }
        },
        languages: {
            extend: function(e, n) {
                var a, t = T.util.clone(T.languages[e]);
                for (a in n)
                    t[a] = n[a];
                return t
            },
            insertBefore: function(a, e, n, t) {
                var r, s = (t = t || T.languages)[a], i = {};
                for (r in s)
                    if (s.hasOwnProperty(r)) {
                        if (r == e)
                            for (var l in n)
                                n.hasOwnProperty(l) && (i[l] = n[l]);
                        n.hasOwnProperty(r) || (i[r] = s[r])
                    }
                var o = t[a];
                return t[a] = i,
                T.languages.DFS(T.languages, function(e, n) {
                    n === o && e != a && (this[e] = i)
                }),
                i
            },
            DFS: function e(n, a, t, r) {
                r = r || {};
                var s, i, l, o = T.util.objId;
                for (s in n)
                    n.hasOwnProperty(s) && (a.call(n, s, n[s], t || s),
                    i = n[s],
                    "Object" !== (l = T.util.type(i)) || r[o(i)] ? "Array" !== l || r[o(i)] || (r[o(i)] = !0,
                    e(i, a, s, r)) : (r[o(i)] = !0,
                    e(i, a, null, r)))
            }
        },
        plugins: {},
        highlightAll: function(e, n) {
            T.highlightAllUnder(document, e, n)
        },
        highlightAllUnder: function(e, n, a) {
            var t = {
                callback: a,
                container: e,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            T.hooks.run("before-highlightall", t),
            t.elements = Array.prototype.slice.apply(t.container.querySelectorAll(t.selector)),
            T.hooks.run("before-all-elements-highlight", t);
            for (var r, s = 0; r = t.elements[s++]; )
                T.highlightElement(r, !0 === n, t.callback)
        },
        highlightElement: function(e, n, a) {
            var t = T.util.getLanguage(e)
              , r = T.languages[t]
              , s = (e.className = e.className.replace(u, "").replace(/\s+/g, " ") + " language-" + t,
            e.parentElement)
              , i = (s && "pre" === s.nodeName.toLowerCase() && (s.className = s.className.replace(u, "").replace(/\s+/g, " ") + " language-" + t),
            {
                element: e,
                language: t,
                grammar: r,
                code: e.textContent
            });
            function l(e) {
                i.highlightedCode = e,
                T.hooks.run("before-insert", i),
                i.element.innerHTML = i.highlightedCode,
                T.hooks.run("after-highlight", i),
                T.hooks.run("complete", i),
                a && a.call(i.element)
            }
            T.hooks.run("before-sanity-check", i),
            i.code ? (T.hooks.run("before-highlight", i),
            i.grammar ? n && o.Worker ? ((s = new Worker(T.filename)).onmessage = function(e) {
                l(e.data)
            }
            ,
            s.postMessage(JSON.stringify({
                language: i.language,
                code: i.code,
                immediateClose: !0
            }))) : l(T.highlight(i.code, i.grammar, i.language)) : l(T.util.encode(i.code))) : (T.hooks.run("complete", i),
            a && a.call(i.element))
        },
        highlight: function(e, n, a) {
            e = {
                code: e,
                grammar: n,
                language: a
            };
            return T.hooks.run("before-tokenize", e),
            e.tokens = T.tokenize(e.code, e.grammar),
            T.hooks.run("after-tokenize", e),
            D.stringify(T.util.encode(e.tokens), e.language)
        },
        tokenize: function(e, n) {
            var a = n.rest;
            if (a) {
                for (var t in a)
                    n[t] = a[t];
                delete n.rest
            }
            for (var r = new g, s = (I(r, r.head, e),
            function e(n, a, t, r, s, i) {
                for (var l in t)
                    if (t.hasOwnProperty(l) && t[l])
                        for (var o = t[l], o = Array.isArray(o) ? o : [o], u = 0; u < o.length; ++u) {
                            if (i && i.cause == l + "," + u)
                                return;
                            var g, c = o[u], d = c.inside, p = !!c.lookbehind, m = !!c.greedy, f = 0, h = c.alias;
                            m && !c.pattern.global && (g = c.pattern.toString().match(/[imsuy]*$/)[0],
                            c.pattern = RegExp(c.pattern.source, g + "g"));
                            for (var y = c.pattern || c, b = r.next, v = s; b !== a.tail && !(i && v >= i.reach); v += b.value.length,
                            b = b.next) {
                                var F = b.value;
                                if (a.length > n.length)
                                    return;
                                if (!(F instanceof D)) {
                                    var k = 1;
                                    if (m && b != a.tail.prev) {
                                        if (y.lastIndex = v,
                                        !($ = y.exec(n)))
                                            break;
                                        var x = $.index + (p && $[1] ? $[1].length : 0)
                                          , w = $.index + $[0].length
                                          , A = v;
                                        for (A += b.value.length; A <= x; )
                                            A += (b = b.next).value.length;
                                        if (v = A -= b.value.length,
                                        b.value instanceof D)
                                            continue;
                                        for (var P = b; P !== a.tail && (A < w || "string" == typeof P.value); P = P.next)
                                            k++,
                                            A += P.value.length;
                                        k--,
                                        F = n.slice(v, A),
                                        $.index -= v
                                    } else {
                                        y.lastIndex = 0;
                                        var $ = y.exec(F)
                                    }
                                    if ($) {
                                        p && (f = $[1] ? $[1].length : 0);
                                        for (var x = $.index + f, _ = $[0].slice(f), w = x + _.length, S = F.slice(0, x), j = F.slice(w), F = v + F.length, E = (i && F > i.reach && (i.reach = F),
                                        b.prev), O = (S && (E = I(a, E, S),
                                        v += S.length),
                                        N = C = z = S = O = void 0,
                                        a), S = E, z = k, C = S.next, N = 0; N < z && C !== O.tail; N++)
                                            C = C.next;
                                        (S.next = C).prev = S,
                                        O.length -= N;
                                        b = I(a, E, new D(l,d ? T.tokenize(_, d) : _,h,_));
                                        j && I(a, b, j),
                                        1 < k && e(n, a, t, b.prev, v, {
                                            cause: l + "," + u,
                                            reach: F
                                        })
                                    }
                                }
                            }
                        }
            }(e, r, n, r.head, 0),
            r), i = [], l = s.head.next; l !== s.tail; )
                i.push(l.value),
                l = l.next;
            return i
        },
        hooks: {
            all: {},
            add: function(e, n) {
                var a = T.hooks.all;
                a[e] = a[e] || [],
                a[e].push(n)
            },
            run: function(e, n) {
                var a = T.hooks.all[e];
                if (a && a.length)
                    for (var t, r = 0; t = a[r++]; )
                        t(n)
            }
        },
        Token: D
    };
    function D(e, n, a, t) {
        this.type = e,
        this.content = n,
        this.alias = a,
        this.length = 0 | (t || "").length
    }
    function g() {
        var e = {
            value: null,
            prev: null,
            next: null
        }
          , n = {
            value: null,
            prev: e,
            next: null
        };
        e.next = n,
        this.head = e,
        this.tail = n,
        this.length = 0
    }
    function I(e, n, a) {
        var t = n.next
          , a = {
            value: a,
            prev: n,
            next: t
        };
        return n.next = a,
        t.prev = a,
        e.length++,
        a
    }
    return (o.Prism = T,
    D.stringify = function n(e, a) {
        if ("string" == typeof e)
            return e;
        var t;
        if (Array.isArray(e))
            return t = "",
            e.forEach(function(e) {
                t += n(e, a)
            }),
            t;
        var r, s = {
            type: e.type,
            content: n(e.content, a),
            tag: "span",
            classes: ["token", e.type],
            attributes: {},
            language: a
        }, e = e.alias, i = (e && (Array.isArray(e) ? Array.prototype.push.apply(s.classes, e) : s.classes.push(e)),
        T.hooks.run("wrap", s),
        "");
        for (r in s.attributes)
            i += " " + r + '="' + (s.attributes[r] || "").replace(/"/g, "&quot;") + '"';
        return "<" + s.tag + ' class="' + s.classes.join(" ") + '"' + i + ">" + s.content + "</" + s.tag + ">"
    }
    ,
    o.document) ? ((e = T.util.currentScript()) && (T.filename = e.src,
    e.hasAttribute("data-manual")) && (T.manual = !0),
    T.manual || ("loading" === (n = document.readyState) || "interactive" === n && e && e.defer ? document.addEventListener("DOMContentLoaded", t) : window.requestAnimationFrame ? window.requestAnimationFrame(t) : window.setTimeout(t, 16))) : o.addEventListener && !T.disableWorkerMessageHandler && o.addEventListener("message", function(e) {
        var e = JSON.parse(e.data)
          , n = e.language
          , a = e.code
          , e = e.immediateClose;
        o.postMessage(T.highlight(a, T.languages[n], n)),
        e && o.close()
    }, !1),
    T;
    function t() {
        T.manual || T.highlightAll()
    }
}(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
"undefined" != typeof global && (global.Prism = Prism),
Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            "internal-subset": {
                pattern: /(\[)[\s\S]+(?=\]>$)/,
                lookbehind: !0,
                greedy: !0,
                inside: null
            },
            string: {
                pattern: /"[^"]*"|'[^']*'/,
                greedy: !0
            },
            punctuation: /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/,
            name: /[^\s<>'"]+/
        }
    },
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    punctuation: [{
                        pattern: /^=/,
                        alias: "attr-equals"
                    }, /"|'/]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: [{
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
    }, /&#x?[\da-f]{1,8};/i]
},
Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity,
Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup,
Prism.hooks.add("wrap", function(e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
}),
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function(e, n) {
        var a = {}
          , a = (a["language-" + n] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[n]
        },
        a.cdata = /^<!\[CDATA\[|\]\]>$/i,
        {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: a
            }
        })
          , n = (a["language-" + n] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[n]
        },
        {});
        n[e] = {
            pattern: RegExp("(<__[^]*?>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function() {
                return e
            }), "i"),
            lookbehind: !0,
            greedy: !0,
            inside: a
        },
        Prism.languages.insertBefore("markup", "cdata", n)
    }
}),
Prism.languages.html = Prism.languages.markup,
Prism.languages.mathml = Prism.languages.markup,
Prism.languages.svg = Prism.languages.markup,
Prism.languages.xml = Prism.languages.extend("markup", {}),
Prism.languages.ssml = Prism.languages.xml,
Prism.languages.atom = Prism.languages.xml,
Prism.languages.rss = Prism.languages.xml,
function(e) {
    var n = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
      , n = (e.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector"
                },
                keyword: {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: !0
                }
            }
        },
        url: {
            pattern: RegExp("\\burl\\((?:" + n.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)", "i"),
            greedy: !0,
            inside: {
                function: /^url/i,
                punctuation: /^\(|\)$/,
                string: {
                    pattern: RegExp("^" + n.source + "$"),
                    alias: "url"
                }
            }
        },
        selector: RegExp("[^{}\\s](?:[^{};\"']|" + n.source + ")*?(?=\\s*\\{)"),
        string: {
            pattern: n,
            greedy: !0
        },
        property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
        important: /!important\b/i,
        function: /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:,]/
    },
    e.languages.css.atrule.inside.rest = e.languages.css,
    e.languages.markup);
    n && (n.tag.addInlined("style", "css"),
    e.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
            inside: {
                "attr-name": {
                    pattern: /^\s*style/i,
                    inside: n.tag.inside
                },
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {
                    pattern: /.+/i,
                    inside: e.languages.css
                }
            },
            alias: "language-css"
        }
    }, n.tag))
}(Prism),
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    }],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
},
Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    }],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}),
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/,
Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
            "regex-source": {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: "language-regex",
                inside: Prism.languages.regex
            },
            "regex-flags": /[a-z]+$/,
            "regex-delimiter": /^\/|\/$/
        }
    },
    "function-variable": {
        pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function"
    },
    parameter: [{
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript
    }, {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}),
Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
        greedy: !0,
        inside: {
            "template-punctuation": {
                pattern: /^`|`$/,
                alias: "string"
            },
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                lookbehind: !0,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}),
Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"),
Prism.languages.js = Prism.languages.javascript;
