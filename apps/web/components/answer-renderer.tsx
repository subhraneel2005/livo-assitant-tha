"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function formatText(text: string) {
  let cleaned = text.replace(/\\n/g, "\n")

  // Convert "Title:" -> ## Title
  cleaned = cleaned.replace(
    /^([A-Z][A-Za-z0-9\s]{3,}):$/gm,
    "## $1"
  )

  // Convert numbered sections into headings
  cleaned = cleaned.replace(
    /^\d+\.\s(.+)/gm,
    "### $1"
  )

  // Ensure paragraphs have spacing
  cleaned = cleaned.replace(/\n{2,}/g, "\n\n")

  return cleaned
}

export default function AnswerRenderer({ text }: { text: string }) {
  const formatted = formatText(text)

  return (
    <div
      className="
      prose prose-invert max-w-none
      prose-h1:text-2xl
      prose-h2:text-xl
      prose-h3:text-lg
      prose-p:text-sm
      prose-li:text-sm
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {formatted}
      </ReactMarkdown>
    </div>
  )
}