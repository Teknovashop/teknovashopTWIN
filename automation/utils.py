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
        "AE_AFF_PLATFORM": os.environ.get("AE_AFF_PLATFORM", ""),
        "AE_AFF_FCID": os.environ.get("AE_AFF_FCID", ""),
        "AE_AFF_FSK": os.environ.get("AE_AFF_FSK", ""),
        "SHEIN_PID": os.environ.get("SHEIN_PID", "")
    }
    cfg_path = Path("data/affiliates.json")
    if cfg_path.exists():
        try:
            data = json.loads(cfg_path.read_text(encoding="utf-8"))
            aff.update({k: v for k, v in data.items() if v})
        except Exception:
            pass
    return aff

def affiliate_links(keyword: str, aff: dict):
    kwq = keyword.replace(' ', '+')
    ali = f"https://s.click.aliexpress.com/e/_search?keywords={kwq}"
    if aff.get("AE_AFF_PLATFORM"):
        ali += f"&aff_platform={aff['AE_AFF_PLATFORM']}"
    if aff.get("AE_AFF_FCID"):
        ali += f"&aff_fcid={aff['AE_AFF_FCID']}"
    if aff.get("AE_AFF_FSK"):
        ali += f"&aff_fsk={aff['AE_AFF_FSK']}"
    shein = f"https://shein.sng.link/{aff.get('SHEIN_PID','')}/search?keyword={kwq}".rstrip('/')
    return ali, shein

def write_markdown_post(title: str, soi: float, body_md: str, keyword: str):
    slug = f"{datetime.utcnow().date().isoformat()}-{slugify(title)}"
    front = f"""---
title: "{title}"
date: "{datetime.utcnow().isoformat()}"
excerpt: "Ranking y guía generados automáticamente por IA para '{keyword}'."
tags: ["{keyword}", "ranking", "guia"]
coverImage: "/og/teknovashop-og.png"
soi: {soi:.4f}
---
"""
    out_dir = Path("content/posts")
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"{slug}.md").write_text(front + "\n" + body_md.strip() + "\n", encoding="utf-8")
    return slug