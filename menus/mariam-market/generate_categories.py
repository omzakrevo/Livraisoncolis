"""Génère un menu A4 par catégorie (HTML) pour Mariam Market — Niankorodougou."""
import os

VILLE = "Niankorodougou"
TEL = "76 55 70 09"

CATEGORIES = [
    ("boissons", "BOISSONS", "Fraîches & chaudes", ["🥤", "🧃", "☕", "🍹"], [
        ("Boissons fraîches", [
            ("Eau minérale 0,5 L", "300"), ("Eau minérale 1,5 L", "500"),
            ("Coca / Fanta / Sprite petit format", "500"), ("Coca / Fanta / Sprite grand format", "1 000"),
            ("Youki / XXL / gazeuse locale", "500"), ("Malta / boisson maltée", "700"),
            ("Jus Bissap", "500"), ("Jus de Gingembre", "500"), ("Jus de Tamarin", "500"),
            ("Jus de Baobab", "500"), ("Cocktail de fruits", "1 000")]),
        ("Boissons chaudes", [
            ("Café simple", "500"), ("Café au lait", "750"), ("Thé", "300"),
            ("Thé au lait", "500"), ("Chocolat chaud", "750")]),
    ]),
    ("maquis", "COIN MAQUIS", "Bières & boissons alcoolisées", ["🍺", "🍻", "🍷", "🥃"], [
        ("Bières", [
            ("Brakina grande (65 cl)", "800"), ("Castel grande (65 cl)", "800"),
            ("Flag grande (65 cl)", "800"), ("So.b.bra grande (65 cl)", "700"),
            ("Beaufort (33 cl)", "600"), ("Heineken (33 cl)", "1 000"),
            ("Guinness petite (33 cl)", "800"), ("Guinness grande (65 cl)", "1 200")]),
        ("Vins & spiritueux", [
            ("Vin rouge (verre)", "500"), ("Vin rouge (bouteille)", "3 500"),
            ("Pastis (verre)", "1 000"), ("Whisky (verre)", "1 000")]),
    ]),
    ("fast-food", "FAST-FOOD & GRILLADES", "Sandwichs, burgers, pizzas", ["🍔", "🌯", "🍕", "🍗"], [
        ("Sandwichs & burgers", [
            ("Pain anglais simple", "500"), ("Pain anglais garni", "1 000"),
            ("Sandwich omelette", "750"), ("Sandwich viande", "1 000"), ("Sandwich poulet", "1 500"),
            ("Hamburger simple", "1 500"), ("Hamburger complet", "2 000"),
            ("Chawarma viande", "1 500"), ("Chawarma poulet", "2 000")]),
        ("Pizzas", [("Pizza petite", "2 500"), ("Pizza moyenne", "4 000"), ("Pizza grande", "6 000")]),
        ("Grillades & frites", [
            ("Saucisse grillée", "500"), ("Brochette de viande", "500"), ("Brochette de poulet", "750"),
            ("Portion de frites", "1 000"), ("Demi-poulet + frites", "2 500"), ("Poulet + frites", "3 500")]),
    ]),
    ("restauration", "RESTAURATION", "Nos plats du jour", ["🍛", "🍝", "🐟", "🍲"], [
        ("Riz & pâtes", [
            ("Riz sauce", "1 000"), ("Riz gras", "1 000"), ("Riz au poulet", "2 000"),
            ("Spaghetti simple", "1 000"), ("Spaghetti viande", "1 500"), ("Spaghetti poulet", "2 000")]),
        ("Attiéké & alloco", [
            ("Attiéké + poisson", "2 000"), ("Attiéké + poulet", "2 500"),
            ("Alloco + œuf", "1 500"), ("Alloco + poulet", "2 500")]),
        ("Omelettes & soupes", [
            ("Omelette simple", "500"), ("Omelette garnie", "1 000"),
            ("Soupe de viande", "1 500"), ("Soupe de poulet", "2 500")]),
    ]),
    ("patisserie", "PÂTISSERIE & PETIT-DÉJEUNER", "Viennoiseries & formules", ["🥐", "🍰", "🍩", "🥖"], [
        ("Pâtisserie", [
            ("Croissant", "500"), ("Pain au chocolat", "500"), ("Cake", "500"),
            ("Madeleine", "250"), ("Beignet", "100"), ("Petit gâteau", "500"),
            ("Part de gâteau", "1 000"), ("Yaourt", "500"), ("Salade de fruits", "1 000")]),
        ("Formules petit-déjeuner", [
            ("Pain + beurre", "500"), ("Pain + omelette", "750"),
            ("Pain + omelette + café", "1 250"), ("Petit-déjeuner complet", "2 000")]),
    ]),
]

CSS = """
@font-face{font-family:Poppins;font-weight:600;src:url(../fonts/Poppins-wght-600.woff) format('woff')}
@font-face{font-family:Poppins;font-weight:800;src:url(../fonts/Poppins-wght-800.woff) format('woff')}
@font-face{font-family:Poppins;font-weight:900;src:url(../fonts/Poppins-wght-900.woff) format('woff')}
@font-face{font-family:Pacifico;src:url(../fonts/Pacifico.woff) format('woff')}
:root{--red:#e31b23;--red2:#b5121a;--blue:#1d4fd8;--ink:#141414}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1240px;height:1754px;font-family:Poppins,sans-serif;color:var(--ink);background:#fff;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;opacity:.07;font-size:54px;display:flex;flex-wrap:wrap;gap:70px 110px;padding:340px 20px 0 60px;filter:grayscale(1);transform:rotate(-8deg) scale(1.2)}
header{position:relative;height:330px}
.band{position:absolute;left:0;top:0;width:100%;height:330px}
.logo{position:absolute;left:44px;top:26px;text-align:center;line-height:.92}
.logo .l1{font-weight:900;font-size:66px;color:#fff;letter-spacing:1px;text-shadow:0 4px 0 rgba(0,0,0,.18)}
.logo .l2{font-weight:900;font-size:78px;color:var(--blue);-webkit-text-stroke:6px #fff;paint-order:stroke fill}
.logo .l3{display:inline-block;margin-top:8px;background:#fff;color:var(--red);font-weight:800;font-size:19px;padding:5px 16px;border-radius:30px;letter-spacing:1.5px}
.title{position:absolute;right:50px;top:0;font-family:Pacifico,cursive;font-size:170px;color:var(--red);-webkit-text-stroke:12px #fff;paint-order:stroke fill;filter:drop-shadow(0 8px 6px rgba(0,0,0,.25));transform:rotate(-4deg)}
.sub{position:absolute;right:70px;top:238px;background:var(--blue);color:#fff;font-weight:800;font-size:22px;padding:6px 22px;border-radius:30px;letter-spacing:2px;box-shadow:0 4px 10px rgba(0,0,0,.2)}
.cat{position:relative;margin:4px 40px 0;text-align:center}
.cat h1{display:inline-block;background:var(--red);color:#fff;font-weight:900;font-style:italic;font-size:54px;padding:10px 48px;border-radius:14px;box-shadow:0 7px 0 var(--red2),0 12px 24px rgba(0,0,0,.2);letter-spacing:1px}
.cat p{margin-top:16px;font-family:Pacifico,cursive;font-size:36px;color:var(--blue)}
main{position:relative;display:grid;grid-template-columns:230px 1fr;gap:36px;padding:24px 44px 0 34px}
.pics{display:flex;flex-direction:column;justify-content:space-around;align-items:center;padding:10px 0 30px}
.pic{width:196px;height:196px;border-radius:50%;background:#fff;border:8px solid var(--blue);display:grid;place-items:center;font-size:118px;box-shadow:0 10px 22px rgba(0,0,0,.2)}
.pic:nth-child(even){border-color:var(--red);transform:translateX(18px)}
.cards{display:flex;flex-direction:column;gap:44px;justify-content:center}
.card{position:relative;background:#fff;border-radius:26px;padding:46px 34px 22px;box-shadow:0 10px 22px rgba(0,0,0,.16);border-top:6px solid var(--red)}
.tab{position:absolute;right:-10px;top:-28px;background:var(--red);color:#fff;font-weight:900;font-style:italic;font-size:26px;padding:8px 28px 8px 36px;clip-path:polygon(18px 0,100% 0,100% 100%,0 100%);border-radius:0 8px 0 0;box-shadow:0 4px 0 var(--red2)}
ul{list-style:none}
li{display:flex;align-items:baseline;font-weight:600;line-height:1.55}
.n{white-space:nowrap}
.d{flex:1;border-bottom:3px dotted #333;margin:0 10px;transform:translateY(-7px);min-width:20px}
.p{font-weight:800;white-space:nowrap}
.warn{position:absolute;left:0;right:0;bottom:104px;text-align:center;font-weight:800;font-size:21px;color:var(--red2)}
footer{position:absolute;left:0;right:0;bottom:0;height:92px;display:flex}
.f1{background:var(--red);color:#fff;width:36%;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:26px;border-radius:0 46px 46px 0;z-index:1}
.f2{background:var(--blue);color:#fff;flex:1;margin-left:-46px;display:flex;align-items:center;justify-content:center;gap:16px;font-weight:900;font-size:40px;letter-spacing:1px}
.f2 small{font-size:28px;font-weight:800}
"""

BAND = """<svg class="band" viewBox="0 0 1240 330" preserveAspectRatio="none">
<path d="M0 0H1240V170C1000 150 760 175 560 200 360 225 180 250 0 270Z" fill="#e31b23"/>
<path d="M0 270C180 250 360 225 560 200 760 175 1000 150 1240 170V196C1000 178 760 200 560 224 360 248 180 272 0 292Z" fill="#1d4fd8"/></svg>"""


def page(title, subtitle, pics, groups, alcool):
    n_items = sum(len(items) for _, items in groups)
    fs = 34 if n_items <= 15 else 31 if n_items <= 17 else 27
    cards = "".join(
        f'<section class="card"><div class="tab">{g.upper()}</div><ul>'
        + "".join(f'<li style="font-size:{fs}px"><span class="n">{n}</span><span class="d"></span>'
                  f'<span class="p">{p}&nbsp;F</span></li>' for n, p in items)
        + "</ul></section>" for g, items in groups)
    bg = "".join(f"<span>{pics[i % len(pics)]}</span>" for i in range(60))
    warn = ('<div class="warn">🔞 Vente interdite aux mineurs · L\'abus d\'alcool est dangereux pour la santé, '
            'à consommer avec modération</div>') if alcool else ""
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Mariam Market · {title.title()}</title><style>{CSS}</style></head><body>
<div class="bg">{bg}</div>
<header>{BAND}
<div class="logo"><div class="l1">MARIAM</div><div class="l2">MARKET</div><div class="l3">ALIMENTATION</div></div>
<div class="title">Menu</div><div class="sub">CAFÉ · RESTAU · PÂTISSERIE</div></header>
<div class="cat"><h1>{title}</h1><p>{subtitle}</p></div>
<main><div class="pics">{''.join(f'<div class="pic">{e}</div>' for e in pics)}</div>
<div class="cards">{cards}</div></main>{warn}
<footer><div class="f1">📞 Commandes&nbsp;:</div><div class="f2">{TEL} <small>| 📍 {VILLE}</small></div></footer>
</body></html>"""


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "categories")
    os.makedirs(out, exist_ok=True)
    for i, (slug, title, sub, pics, groups) in enumerate(CATEGORIES, 1):
        with open(os.path.join(out, f"{i}-{slug}.html"), "w", encoding="utf-8") as f:
            f.write(page(title, sub, pics, groups, slug == "maquis"))
