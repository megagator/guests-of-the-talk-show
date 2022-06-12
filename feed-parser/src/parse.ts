import { xml2js } from 'xml-js'
import { writeFileSync, readFileSync } from 'fs'
import fetch from 'node-fetch'

import { SortOrder } from './enum/SortOrder'
import slugify from './utilities/slugify'

const last_request_headers_file = '../content/last_request_headers.json'

const last_request_headers_raw = readFileSync(
  last_request_headers_file
).toString('utf-8')
const last_request_headers = JSON.parse(last_request_headers_raw)
const etag = last_request_headers.etag
  .join(',')
  .replace('W/', '')
  .replace('-gzip', '')

const rss_url = 'https://daringfireball.net/thetalkshow/rss'

console.log('Fetching feed...')

fetch(rss_url, {
  method: 'GET',
  headers: {
    'If-None-Match': etag,
  },
})
  .then((response) => {
    console.log(response.status)

    if (response.status === 304) {
      console.log('no new feed')
      process.exit(1)
    }

    console.log('New feed: %s', response.headers.get('etag'))
    console.log('Last modified: %s', response.headers.get('last-modified'))
    writeFileSync(
      last_request_headers_file,
      JSON.stringify(response.headers.raw(), null, 2)
    )

    response.text().then((xmlString) => {
      const js: IRss = xml2js(xmlString, {
        compact: true,
        ignoreComment: true,
      }) as IRss

      const podcasts: IPodcastEpisode[] = []
      const titleRegex =
        /^(\w+):\s‘(.*)’,? with (?:(?:special )?guests? )?(.*)/i
      const quotelessTitleRegex =
        /^(\w+):\s(.*),? with (?:(?:special )?guests? )?(.*)/i
      const titleWithOutGuestRegex = /^(\w+):\s‘(.*)’/i
      const nameRegex = /,|(?: and )/i
      for (const podcast of js.rss.channel.item) {
        const episode: IPodcastEpisode = {
          number: 0,
          title: '',
          slug: '',
          rawTitle: podcast.title._text,
          guests: [],
          link: podcast.link._text,
          pubDate: new Date(podcast.pubDate._text),
          file: {
            url: podcast.enclosure._attributes.url,
            fileSizeBytes: parseInt(podcast.enclosure._attributes.length),
            type: podcast.enclosure._attributes.type,
          },
          duration: podcast['itunes:duration']._text,
          durationSeconds: convertFriendlyDurationToSeconds(
            podcast['itunes:duration']._text
          ),
          explicit: podcast['itunes:explicit']?._text == 'yes' || false,
          imageUrl: podcast['itunes:image']?._attributes.href || '',
          author: podcast['itunes:author']._text,
          description: podcast.description._text,
          showNotes: podcast['content:encoded']._cdata.trim(),
        }

        let match = podcast.title._text.match(titleRegex)
        if (!match) {
          match = podcast.title._text.match(quotelessTitleRegex)
        }

        if (match) {
          episode.number = getEpisodeNumber(match[1])
          episode.title = match[2].trim().replace(/,$/, '')

          let names = match[3].split(nameRegex)
          if (names.length === 0) {
            throw new Error(`Unable to parse ${podcast.title._text}`)
          }

          names = names
            .filter((n: string) => n.length > 0)
            .filter((n: string) => n.toLowerCase() !== 'more')
            .map(lastHopeNormalizer)

          if (names.length === 0) {
            throw new Error(`Unable to parse names in ${podcast.title._text}`)
          }
          episode.guests = names
        } else {
          const guestlessMatch = podcast.title._text.match(
            titleWithOutGuestRegex
          )
          if (guestlessMatch) {
            episode.number = getEpisodeNumber(guestlessMatch[1])
            episode.title = guestlessMatch[2].replace('’', '')

            // one-off patches
            switch (episode.number) {
              case 188:
                episode.guests.push('Lisa Jackson')
                break
              case 227:
                break
              default:
                throw new Error(
                  `New potentially guestless episode to manually handle: ${podcast.title._text}`
                )
            }
          } else {
            throw new Error(`Unable to parse ${podcast.title._text}`)
          }
        }
        episode.slug = `${episode.number}-${slugify(episode.title)}`

        podcasts.push(episode)
      }

      // all episodes
      writeFileSync(
        '../content/episodes.json',
        JSON.stringify(podcasts, null, 2)
      )

      console.log('New episode: %s', podcasts[0].rawTitle)

      // grouped by guest appearance
      let groupedByGuest: IGuestAppearances = {}
      for (const podcast of podcasts) {
        const appearance: IAppearance = {
          episodeNumber: podcast.number,
          episodeTitle: podcast.title,
          date: podcast.pubDate,
          durationSeconds: convertFriendlyDurationToSeconds(podcast.duration),
        }
        for (const guest of podcast.guests) {
          if (!groupedByGuest[guest]) {
            groupedByGuest[guest] = []
          }
          groupedByGuest[guest].push(appearance)
        }
      }
      groupedByGuest = sortGuestsByAppearances(groupedByGuest)
      writeFileSync(
        '../content/guests.json',
        JSON.stringify(groupedByGuest, null, 2)
      )

      function getEpisodeNumber(s: string): number {
        let num = parseInt(s)
        if (isNaN(num)) {
          num = parseRomanNumeral(s)
        }
        return num
      }

      function parseRomanNumeral(s: string): number {
        // I could write a roman numeral conversion here, but so far this should be fine
        return 99
      }

      function lastHopeNormalizer(n: string): string {
        n = n
          .replace('‘Bengate’ ', '')
          .replace(/\(side \d\)/i, '')
          .replace(' From Panic', '')
          .replace(/’$/, '')

        return n.trim()
      }

      function convertFriendlyDurationToSeconds(
        friendlyDuration: string
      ): number {
        const parts = friendlyDuration.split(':')
        const seconds = parseInt(parts[2])
        const minutes = parseInt(parts[1])
        const hours = parseInt(parts[0])

        if (seconds == NaN || minutes == NaN || hours == NaN) {
          throw new Error(`unknown duration format: ${friendlyDuration}`)
        }

        return seconds + minutes * 60 + hours * 60 * 60
      }

      function sortGuestsByAppearances(
        data: IGuestAppearances,
        order = SortOrder.descending
      ): IGuestAppearances {
        const items = Object.keys(data).map((key) => ({
          key: key,
          value: data[key],
        }))

        items.sort((a, b) => {
          if ((order = SortOrder.ascending)) {
            return a.value.length - b.value.length
          } else {
            return b.value.length - a.value.length
          }
        })

        const result: IGuestAppearances = {}
        for (const item of items) {
          result[item.key] = item.value
        }

        return result
      }
    })
  })
  .catch((err) => {
    console.log(err)
  })
