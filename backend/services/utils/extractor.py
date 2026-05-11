import fitz
from docx import Document


# PDF 
def extract_pdf_text(file_path):

    text = ""

    doc = fitz.open(file_path)

    for page in doc:
        text += page.get_text()

    return text 


# DOCX

def extract_docx_text(file_path):

    text = []

    doc = Document(file_path)

    for para in doc.paragraphs:
        text.append(para.text)

    return "\n".join(text)

# TXT 
def extract_txt_text(file_path):

    with open(file_path, "r", encoding='utf-8') as f:
        return f.read()
    

# MAIN EXTRACTOR

def extract_text(file_path, file_name):
    if file_name.endswith('.pdf'):

        return extract_pdf_text(file_path=file_path)
    
    elif file_name.endswith('.docx'):

        return extract_docx_text(file_path=file_path)
    
    elif file_name.endswith('.txt'):

        return extract_txt_text(file_path=file_path)
    
    else:

        raise Exception(
            "Unsupported File Type"
        )