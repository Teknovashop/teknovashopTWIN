from .utils import read_affiliates, affiliate_links, write_markdown_post

TEMPLATE = """
{body}

### Dónde comprar
- Amazon (búsqueda): [Ver ofertas]({amazon})
- SHEIN (búsqueda): [Ver productos]({shein})

> Enlaces de afiliado: podríamos recibir una comisión sin coste extra para ti.
"""

def build_body(keyword: str, article_md: str):
    aff = read_affiliates()
    amazon, shein = affiliate_links(keyword, aff)
    return TEMPLATE.format(body=article_md.strip(), amazon=amazon, shein=shein)

def save_post(title: str, soi: float, body_md: str, keyword: str):
    return write_markdown_post(title, soi, body_md, keyword)