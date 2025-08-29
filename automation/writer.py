import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

MODEL_NAME = os.environ.get("WRITER_MODEL", "google/flan-t5-small")

def load_writer():
    tok = AutoTokenizer.from_pretrained(MODEL_NAME)
    mdl = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    return pipeline("text2text-generation", model=mdl, tokenizer=tok)

PROMPT_TMPL = "Eres un redactor experto en compras. Redacta en español un artículo breve (600-800 palabras) que incluya:\n- Introducción útil para el comprador sobre \"{keyword}\".\n- Un ranking de 3 perfiles de comprador (bajo presupuesto, equilibrado, premium) con pros y contras.\n- Consejos de compra y checklist.\n- FAQ corta (3 preguntas).\n- Llamadas a la acción claras (sin URLs).\n- Mantén un tono práctico y evita afirmaciones falsas.\n"

def generate_article(keyword: str, soi: float):
    try:
        nlp = load_writer()
        prompt = PROMPT_TMPL.format(keyword=keyword)
        out = nlp(prompt, max_new_tokens=700)[0]["generated_text"]
        return out
    except Exception as e:
        fallback = """## Guía de compra: {keyword}

Este tema presenta un interés creciente (Índice SOI ~ {soi}). A continuación tienes una guía práctica con tres perfiles de compra y un checklist de verificación.

### Perfiles
- **Bajo presupuesto:** Prioriza lo esencial y fiabilidad básica.
- **Equilibrado:** Buena relación calidad-precio con alguna función premium.
- **Premium:** Máximo rendimiento y mejor construcción.

### Checklist
1) Garantía y devoluciones
2) Opiniones de usuarios
3) Compatibilidad y dimensiones
4) Consumo y ruido

### FAQ
**¿Cómo elegir?** Define presupuesto y funciones imprescindibles.
**¿Hace falta marca conocida?** No siempre; compara garantías.
**¿Cuándo comprar?** Aprovecha campañas y cupones.

> CTA: Ver ofertas hoy.
""".format(keyword=keyword, soi=f"{int(soi*100)}%")
        return fallback