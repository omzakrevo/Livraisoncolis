"""PDF A4 simple et léger à partir des PNG des pages (compatible avec tous les lecteurs, y compris sur téléphone)."""
import sys
from PIL import Image

def make_pdf(pngs, out):
    pages = [Image.open(p).convert("RGB") for p in pngs]
    pages[0].save(out, "PDF", resolution=300.0, save_all=True, append_images=pages[1:], quality=88)

if __name__ == "__main__":
    make_pdf(sys.argv[2:], sys.argv[1])
