# TaxBot AI - Income Tax RAG Chatbot

Ask questions about the Indian Income Tax Act and Rules.
Powered by LangChain, FLAN-T5, FAISS and the Vercel AI SDK.

## Run Locally

```bash
# install Python dependencies
pip install -r requirements.txt

# generate the FAISS vector store
python vectorstore/generate_vectorstore.py

# install Node dependencies
npm install

# start the development server
npm run dev
```