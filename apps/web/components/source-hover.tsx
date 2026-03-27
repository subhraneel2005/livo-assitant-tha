"use client"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

type Props = {
  videoId: string
  timestamp: string
  url: string
}

function getEmbed(url: string) {
  const videoId = url.match(/v=([^&]+)/)?.[1]
  const start = url.match(/t=(\d+)/)?.[1] ?? "0"

  return `https://www.youtube.com/embed/${videoId}?start=${start}`
}

export default function SourceHover({ videoId, timestamp, url }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <a href={url} target="_blank" className="underline cursor-pointer">
          {videoId} {timestamp}
        </a>
      </HoverCardTrigger>

      <HoverCardContent className="w-64 p-2">
        <iframe
          className="w-full h-36 rounded"
          src={getEmbed(url)}
          allowFullScreen
        />
      </HoverCardContent>
    </HoverCard>
  )
}