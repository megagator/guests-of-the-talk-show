interface IGuestAppearances {
  [key: string]: IAppearance[]
}

interface IAppearance {
  episodeNumber: number
  episodeTitle: string
  date: Date
  durationSeconds: number
}
