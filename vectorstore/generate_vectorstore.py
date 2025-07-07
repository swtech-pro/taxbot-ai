# ? Vectorstore Generator Script (Final Version)
# This script generates FAISS vectorstore from PDF files using LangChain + HuggingFace embeddings.

# ??? Install/Upgrade required packages if not already installed:
# !pip install --upgrade langchain langchain-community faiss-cpu sentence-transformers

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import os

# ?? Path to your PDF folder
pdf_dir = "pdfs"
all_docs = []

# ?? Load all PDFs
for file in os.listdir(pdf_dir):
    if file.endswith(".pdf"):
        print(f"?? Loading {file} ...")
        loader = PyPDFLoader(os.path.join(pdf_dir, file))
        all_docs.extend(loader.load())

# ?? Split documents into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(all_docs)
print(f"? Total chunks created: {len(chunks)}")

# ?? Generate embeddings using Hugging Face model
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# ??? Create FAISS vectorstore
vectorstore = FAISS.from_documents(chunks, embedding_model)

# ?? Save to local folder
vectorstore.save_local("vectorstore/income_tax_faiss")
print("? FAISS vectorstore saved at vectorstore/income_tax_faiss")
