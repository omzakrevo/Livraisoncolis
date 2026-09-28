"""Menu Mariam Market complet sur 2 pages A4, dans la mise en page du modèle (photos à gauche)."""
import os
from generate_photos import CSS, HEAD, JS, pic
from generate_categories import TEL, VILLE

PAGES = [
    ("1-boissons-petit-dejeuner", ["photo:pain", "photo:cafe", "photo:bieres"], [
        ("PETIT-DÉJEUNER", [
            ("Café simple / au lait", "500f / 750f"), ("Thé / Thé au lait", "300f / 500f"),
            ("Chocolat chaud", "750f"), ("Croissant / Pain au chocolat", "500f"),
            ("Cake / Petit gâteau / Yaourt", "500f"), ("Madeleine / Beignet", "250f / 100f"),
            ("Part de gâteau / Salade de fruits", "1000f"), ("Pain + beurre / + omelette", "500f / 750f"),
            ("Pain + omelette + café", "1250f"),
            ("Petit-déjeuner complet", "2000f")]),
        ("NOS BOISSONS", [
            ("Eau minérale 0,5 L / 1,5 L", "300f / 500f"), ("Coca / Fanta / Sprite", "500f / 1000f"),
            ("Youki / XXL", "500f"), ("Malta", "700f"),
            ("Jus Bissap / Gingembre", "500f"), ("Jus Tamarin / Baobab", "500f"),
            ("Cocktail de fruits", "1000f")]),
        ("COIN MAQUIS", [
            ("Brakina / Castel / Flag (65 cl)", "800f"), ("So.b.bra (65 cl)", "700f"),
            ("Beaufort (33 cl)", "600f"), ("Heineken (33 cl)", "1000f"),
            ("Guinness petite / grande", "800f / 1200f"), ("Vin rouge verre / bouteille", "500f / 3500f"),
            ("Pastis / Whisky (verre)", "1000f")]),
    ]),
    ("2-plats-fast-food", ["photo:burger", "photo:brochettes", "photo:riz-gras", "photo:spaghetti", "photo:riz-poulet"], [
        ("NOS FAST-FOOD", [
            ("Pain anglais simple / garni", "500f / 1000f"), ("Sandwich omelette", "750f"),
            ("Sandwich viande / poulet", "1000f / 1500f"), ("Hamburger simple / complet", "1500f / 2000f"),
            ("Chawarma viande / poulet", "1500f / 2000f"), ("Pizza petite", "2500f"),
            ("Pizza moyenne", "4000f"), ("Pizza grande", "6000f")]),
        ("NOS GRILLADES", [
            ("Saucisse grillée", "500f"), ("Brochette viande / poulet", "500f / 750f"),
            ("Portion de frites", "1000f"), ("Demi-poulet + frites", "2500f"), ("Poulet + frites", "3500f")]),
        ("NOS PLATS", [
            ("Riz sauce / Riz gras", "1000f"), ("Riz au poulet", "2000f"),
            ("Spaghetti simple / viande", "1000f / 1500f"), ("Spaghetti poulet", "2000f"),
            ("Attiéké + poisson / poulet", "2000f / 2500f"), ("Alloco + œuf / poulet", "1500f / 2500f"),
            ("Omelette simple / garnie", "500f / 1000f"), ("Soupe viande / poulet", "1500f / 2500f")]),
    ]),
]

EXTRA_CSS = """
.pics img{max-width:340px;max-height:var(--ph,280px)}
.cards{gap:66px;padding-top:60px}
.card{padding:26px 32px 16px 28px}
"""


def page(slug, pics, groups):
    cards = "".join(
        f'<section class="card"><div class="tab">{g}</div><ul>'
        + "".join(f'<li><span class="n">{n}</span><span class="d"></span><span class="p">{p}</span></li>'
                  for n, p in items) + "</ul></section>" for g, items in groups)
    bg = "".join(f"<span>{e}</span>" for e in (["🥕", "🧅", "🍅", "🌶", "🥬"] * 20))
    maquis = any(g == "COIN MAQUIS" for g, _ in groups)
    warn = ('<div class="warn">🔞 Alcool : vente interdite aux mineurs · L\'abus d\'alcool est dangereux pour la santé, '
            'à consommer avec modération</div>') if maquis else ""
    ph = 1300 // len(pics) - 20
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Mariam Market · Menu</title><style>{CSS}{EXTRA_CSS}</style></head><body style="--ph:{min(ph, 400)}px">
<div class="bg">{bg}</div>{HEAD}
<div class="logo"><div class="l1">MARIAM</div><div class="l2">MARKET</div><div class="l3">CAFÉ · RESTAU · PÂTISSERIE</div></div>
<div class="title">Menu</div>
<main{' style="bottom:150px"' if maquis else ''}><div class="pics">{''.join(pic(s) for s in pics)}</div><div class="cards">{cards}</div></main>{warn}
<div class="foot"><div class="f1">📞 Infoline : (+226)</div><div class="f2">{TEL.replace(' ', '.')} &nbsp;|&nbsp; {VILLE}</div></div>
<div class="strip"></div>{JS}</body></html>"""


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "deux-pages")
    os.makedirs(out, exist_ok=True)
    for slug, pics, groups in PAGES:
        with open(os.path.join(out, f"{slug}.html"), "w", encoding="utf-8") as f:
            f.write(page(slug, pics, groups))
