import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
SRC = "/tmp/claude-0/-home-user-Livraisoncolis/65692dd4-a63b-5648-9def-e8509cf5b544/images/2.jpg"
c = np.asarray(Image.open(SRC).convert("RGB").crop((15, 212, 285, 420))).astype(float)
mn = c.min(2)
edges = np.hypot(ndimage.sobel(mn, 0), ndimage.sobel(mn, 1)) > 60
fg = edges | (mn < 200)
fg = ndimage.binary_closing(fg, iterations=6)
fg = ndimage.binary_fill_holes(fg)
fg = ndimage.binary_opening(fg, iterations=3)
lab, n = ndimage.label(fg)
sizes = ndimage.sum(fg, lab, range(1, n + 1))
fg = lab == (np.argmax(sizes) + 1)
a = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
rgba = Image.fromarray(c.astype(np.uint8)).convert("RGBA"); rgba.putalpha(a)
rgba = rgba.crop(rgba.getbbox())
rgba = rgba.resize((rgba.width * 3, rgba.height * 3), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
rgba.save("cafe.png")
bg = Image.new("RGB", rgba.size, (60, 160, 90)); bg.paste(rgba, (0, 0), rgba)
bg.save("/tmp/claude-0/-home-user-Livraisoncolis/65692dd4-a63b-5648-9def-e8509cf5b544/scratchpad/cafe.png")
