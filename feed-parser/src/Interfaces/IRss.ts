interface IRss {
  _declaration: Record<string, string>
  rss: {
    _attributes: {
      version: string
      'xmlns:content': string
      'xmlns:itunes': string
      'xmlns:media': string
    }
    channel: {
      title: ITextString
      description: ITextString
      link: ITextString
      language: ITextString
      lastBuildDate: ITextString
      'itunes:new-feed-url': ITextString
      'itunes:author': ITextString
      'itunes:image': {
        _attributes: {
          href: string
        }
      }
      'itunes:explicit': ITextString
      'itunes:owner': {
        'itunes:name': ITextString
        'itunes:email': ITextString
      }
      'itunes:category': {
        _attributes: ITextString
      }
      copyright: ITextString
      item: IPodcast[]
    }
  }
}

interface IPodcast {
  title: ITextString
  link: ITextString
  guid: ITextString
  pubDate: ITextString
  enclosure: {
    _attributes: {
      url: string
      length: string
      type: string
    }
  }
  'itunes:duration': ITextString
  'itunes:explicit': ITextString | undefined
  'itunes:author': ITextString
  description: ITextString
  'itunes:image':
    | {
        _attributes: {
          href: string
        }
      }
    | undefined
  'content:encoded': {
    _cdata: string
  }
}

interface ITextString {
  _text: string
}
