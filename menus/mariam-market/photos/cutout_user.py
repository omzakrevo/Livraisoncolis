"""Détourage des photos fournies (bières, spaghetti, riz gras, riz au poulet)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
IMG = "/tmp/claude-0/-home-user-Livraisoncolis/65692dd4-a63b-5648-9def-e8509cf5b544/images/"


def save(rgb, mask, name, blur=1.5, max_side=900):
    a = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    im = Image.fromarray(rgb).convert("RGBA"); im.putalpha(a)
    im = im.crop(im.getbbox()); im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(f"{name}.png"); print(name, im.size)


def white_flood(rgb, thr=232):
    c = rgb.astype(float); bgish = (c.min(2) > thr) & ((c.max(2) - c.min(2)) < 20)
    lab, _ = ndimage.label(bgish)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    return ndimage.binary_fill_holes(~np.isin(lab, list(edge)))


def disc(shape, cx, cy, r):
    m = Image.new("L", (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), fill=1)
    return np.asarray(m).astype(bool)


b = np.asarray(Image.open(IMG + "3.jpg").convert("RGB")); save(b, white_flood(b, 238), "bieres")
s = np.asarray(Image.open(IMG + "4.jpg").convert("RGB"))
ys, xs = np.nonzero(s.min(2) < 240); cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
save(s, disc(s.shape, cx, cy, min(xs.max() - xs.min(), ys.max() - ys.min()) / 2 - 2), "spaghetti")
j = np.asarray(Image.open(IMG + "5.jpg").convert("RGB"))
save(j, disc(j.shape, 537, 672, 532), "riz-gras")
r = np.asarray(Image.open(IMG + "6.jpg").convert("RGB"))
save(r, disc(r.shape, 541, 548, 528), "riz-poulet")
