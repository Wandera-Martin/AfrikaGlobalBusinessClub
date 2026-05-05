import fitz
import os

file_path = r"c:\Users\user\Desktop\django pr\onboarding-business.pdf"
doc = fitz.open(file_path)

for i in range(len(doc)):
    for img in doc.get_page_images(i):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha > 3:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        pix.save(f"c:/Users/user/Desktop/django pr/page_{i}_img_{xref}.png")
        pix = None
print("Images extracted!")
