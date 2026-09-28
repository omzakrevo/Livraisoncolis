import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
SRC = "/tmp/claude-0/-home-user-Livraisoncolis/65692dd4-a63b-5648-9def-e8509cf5b544/images/2.jpg"
im = Image.open(SRC).convert("RGB")
boxes = {"cafe": (15, 212, 285, 420), "pain": (18, 420, 275, 605), "burger": (28, 612, 292, 865),
         "poulet": (20, 862, 275, 1005), "brochettes": (15, 1030, 278, 1182)}
for name, box in boxes.items():
    c = np.asarray(im.crop(box)).astype(float)
    mx, mn = c.max(2), c.min(2)
    sat = (mx - mn) / np.maximum(mx, 1)
    bgish = (mn > 178) & (sat < 0.13)
    lab, _ = ndimage.label(bgish)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    fg = ~bg
    fg = ndimage.binary_opening(fg, iterations=1)
    lab2, n = ndimage.label(fg)
    if n:
        sizes = ndimage.sum(fg, lab2, range(1, n + 1))
        fg = np.isin(lab2, [i + 1 for i, s in enumerate(sizes) if s > 0.02 * fg.sum()])
    fg = ndimage.binary_fill_holes(fg)
    a = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = Image.fromarray(c.astype(np.uint8)).convert("RGBA"); rgba.putalpha(a)
    rgba = rgba.crop(rgba.getbbox())
    rgba = rgba.resize((rgba.width * 3, rgba.height * 3), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    rgba.save(f"{name}.png")
    print(name, rgba.size)
