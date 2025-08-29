from pytrends.request import TrendReq
import pandas as pd

def get_trending_keywords(geo="ES", cat=0, n=3):
    pytrends = TrendReq(hl='es-ES', tz=120)
    kw_pool = ["gadgets", "smartwatch", "aspiradora", "robot cocina", "camara seguridad", "proyector", "bicicleta electrica", "suplementos gimnasio", "zapatillas running", "teclado mecanico", "dron"]
    rows = []
    for kw in kw_pool:
        try:
            pytrends.build_payload([kw], cat=cat, timeframe='today 3-m', geo=geo, gprop='')
            df = pytrends.interest_over_time()
            if df.empty: 
                continue
            s = df[kw].astype(float)
            if len(s) < 10: 
                continue
            slope = (s.iloc[-1] - s.iloc[0]) / max(1, s.mean())
            vol = s.std() / max(1, s.mean())
            soi = max(0.0, min(1.0, (0.6*slope + 0.4*vol) / 2.0 + 0.5))
            rows.append({"keyword": kw, "soi": float(soi)})
        except Exception:
            continue
    df = pd.DataFrame(rows).sort_values("soi", ascending=False)
    return df.head(n)