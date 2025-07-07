import { NextRequest, NextResponse } from 'next/server';
import { loadQAStuffChain } from 'langchain/chains';
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { FAISS } from 'langchain/vectorstores/faiss';
import { HuggingFaceInference } from 'langchain/llms/hf';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const question = messages[messages.length - 1]?.content;

  // Load FAISS vectorstore from file
  const vectorStore = await FAISS.load(
    'vectorstore/income_tax_faiss',
    new HuggingFaceInferenceEmbeddings(),
  );

  // Retrieve relevant documents
  const docs = await vectorStore.similaritySearch(question, 3);

  // Load FLAN-T5 model
  const model = new HuggingFaceInference({
    model: 'google/flan-t5-large',
    temperature: 0.5,
  });

  const chain = loadQAStuffChain(model);
  const response = await chain.call({ input_documents: docs, question });

  return NextResponse.json({ role: 'assistant', content: response.text });
}