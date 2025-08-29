import os, re, unicodedata, json
from pathlib import Path
from datetime import datetime

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^a-zA-Z0-9\- ]+', '', text).strip().lower()
    text = re.sub(r'\s+', '-', text)
    return text[:64] or 'post'

def read_affiliates():
    aff = {
        "AFFILIATE_TAG": os.environ.get("AFFILIATE_TAG", "teknovashop25-21"),
        "SHEIN_PID": os.environ.get("SHEIN_PID", "5798341419")
    }
    cfg_path = Path("data/affiliates.json")
    if cfg_path.exists():
        try:
            data = json.loads(cfg_path.read_text(encoding="utf-8"))
            aff.update({k: v for k, v in data.items() if v})
        except Exception:
            pass
    return aff

def affiliate_links(keyword: str, aff: dict, geo="ES"):
    kwq = keyword.replace(' ', '+')
    amazon_domain = "amazon.es" if geo.upper() == "ES" else "amazon.com"
    tag = aff.get("AFFILIATE_TAG", "teknovashop25-21")
    amazon = f"https://www.{amazon_domain}/s?k={kwq}"
    if tag:
        sep = "&" if "?" in amazon else "?"
        amazon = f"{amazon}{sep}tag={tag}"
    shein_pid = aff.get("SHEIN_PID", "5798341419")
    shein = f"https://shein.sng.link/{shein_pid}/search?keyword={kwq}".rstrip('/')
    return amazon, shein

def write_markdown_post(title: str, soi: float, body_md: str, keyword: str):
    slug = f"{datetime.utcnow().date().isoformat()}-{slugify(title)}"
    front = f"""---
title: "{title}"
date: "{datetime.utcnow().isoformat()}"
excerpt: "Guía y ranking generados automáticamente por IA para '{keyword}'."
tags: ["{keyword}", "ranking", "guia"]
coverImage: "/og/teknovashop-og.png"
soi: {soi:.4f}
---
"""
    out_dir = Path("content/posts")
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"{slug}.md").write_text(front + "\n" + body_md.strip() + "\n", encoding="utf-8")
    return slug