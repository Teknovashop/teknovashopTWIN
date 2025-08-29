import os
from pathlib import Path
from topics import get_trending_keywords
from writer import generate_article
from build_post import build_body, save_post

def main():
    df = get_trending_keywords(geo=os.environ.get("GEO","ES"), n=1)
    rows = []
    try:
        rows = list(df.itertuples(index=False))
    except Exception:
        rows = []
    if not rows:
        class R: pass
        r = R(); r.keyword="gadgets"; r.soi=0.65
        rows = [r]

    for row in rows:
        kw = row.keyword
        soi = float(getattr(row, "soi", 0.6))
        article = generate_article(kw, soi)
        body = build_body(kw, article)
        title = f"{kw.title()}: Guía y ranking automático"
        slug = save_post(title, soi, body, kw)
        print(f"[OK] Generated post: {slug}")

if __name__ == "__main__":
    Path("content/posts").mkdir(parents=True, exist_ok=True)
    main()