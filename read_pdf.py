import fitz

file_path = r"c:\Users\user\Desktop\django pr\onboarding-business.pdf"
doc = fitz.open(file_path)

for i in range(len(doc)):
    page = doc.load_page(i)
    text = page.get_text()
    print(f"--- Page {i + 1} ---")
    print(text)
