interface IPodcastEpisode {
  number: number
  title: string
  slug: string
  rawTitle: string
  link: string
  pubDate: Date
  file: {
    url: string
    fileSizeBytes: number
    type: string
  }
  duration: string
  durationSeconds: number
  explicit: boolean
  imageUrl: string
  author: string
  guests: string[]
  description: string
  showNotes: string
}
