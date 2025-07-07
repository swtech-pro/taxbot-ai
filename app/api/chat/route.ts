// ? route.ts - for Edge Function (Next.js App Router)
import { StreamingTextResponse } from 'ai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { HuggingFaceInference } from '@langchain/community/llms/hf'
import { FAISS } from 'langchain/vectorstores/faiss'
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf'
import { Document } from '@langchain/core/documents'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const question = messages[messages.length - 1].content

  const embeddings = new HuggingFaceTransformersEmbeddings()
  const vectorstore = await FAISS.load('vectorstore/income_tax_faiss', embeddings)
  const docs = await vectorstore.similaritySearch(question, 3)

  const context = docs.map((doc: Document) => doc.pageContent).join('\n')

  const prompt = ChatPromptTemplate.fromTemplate(
    'Answer the question based on the Indian Income Tax laws:\n\n{context}\n\nQuestion: {question}'
  )

  const formatted = await prompt.formatMessages({ context, question })

  const model = new HuggingFaceInference({
    model: 'google/flan-t5-large',
    apiKey: process.env.HUGGINGFACE_API_KEY
  })

  const stream = await model.stream(formatted)

  return new StreamingTextResponse(stream)
}
