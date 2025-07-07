// app/page.tsx

'use client';
import { useChat } from 'ai/react';
import Image from 'next/image';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <Image src="/logo.png" alt="TaxBot Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold ml-2">TaxBot AI</h1>
      </div>
      <p className="mb-4 text-gray-600">Ask me anything about India’s Income Tax laws!</p>

      <div className="space-y-4 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <strong>{m.role === 'user' ? 'You' : 'TaxBot'}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-grow border rounded px-3 py-2"
          placeholder="e.g. What is Section 139?"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Ask</button>
      </form>
    </main>
  );
}
