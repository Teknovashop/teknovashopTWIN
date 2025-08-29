import os, json, hashlib, time
from pathlib import Path
from urllib.parse import urlparse
import requests

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data" / "products.json"
OUT_DIR = ROOT / "public" / "imgcache"
OUT_DIR.mkdir(parents=True, exist_ok=True)

def fname(url: str) -> str:
    import hashlib
    h = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    ext = ".jpg"
    path = urlparse(url).path or ""
    if path.lower().endswith(".png"): ext = ".png"
    return f"{h}{ext}"

def download(url: str, dest: Path, timeout=25):
    try:
        r = requests.get(url, timeout=timeout, headers={"User-Agent": "Mozilla/5.0 (TeknovashopImgBot/1.0)"})
        if r.status_code == 200 and r.content:
            dest.write_bytes(r.content); return True
    except Exception:
        pass
    return False

def main():
    products = json.loads(DATA.read_text(encoding="utf-8"))
    changed = False
    for p in products:
        img = p.get("image") or ""
        if not img.startswith("http"):
            continue
        name = fname(img)
        dest = OUT_DIR / name
        if not dest.exists():
            ok = download(img, dest); time.sleep(0.2)
            if not ok:
                dest.write_bytes(bytes([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,12,73,68,65,84,120,156,99,248,15,4,0,9,251,3,253,176,154,188,104,0,0,0,0,73,69,78,68,174,66,96,130]))
        local = f"/imgcache/{name}"
        if p.get("image") != local:
            p["image"] = local; changed = True
    if changed:
        DATA.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8"); print("Updated products.json")
    else:
        print("No changes")

if __name__ == "__main__":
    main()
