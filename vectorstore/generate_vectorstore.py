# vectorstore/generate_vectorstore.py

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import os

# Step 1: List of PDF files
pdf_files = [
    "pdfs/income-tax-act-1961.pdf",
    "pdfs/a1961-43.pdf",
    "pdfs/income-tax-rules-1962.pdf"
]

# Step 2: Load and combine all documents
all_docs = []
for pdf in pdf_files:
    loader = PyPDFLoader(pdf)
    docs = loader.load()
    all_docs.extend(docs)

# Step 3: Split into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(all_docs)

# Step 4: Generate embeddings
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Step 5: Create and save FAISS vectorstore
vectorstore = FAISS.from_documents(chunks, embedding)
vectorstore.save_local("vectorstore/income_tax_faiss")

