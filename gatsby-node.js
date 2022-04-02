const path = require('path')
const slugify = require('./src/utilities/slugify')
const Guests = require('./content/guests.json')
const Episodes = require('./content/episodes.json')

exports.createPages = ({ actions }) => {
  const { createPage } = actions

  Object.keys(Guests).map((guest) => {
    createPage({
      path: `/guest/${slugify(guest)}`,
      component: path.resolve('./src/templates/guestTemplate.js'),
      context: {
        guest,
      },
    })
  })

  Episodes.map((epi) => {
    createPage({
      path: `/episode/${epi.slug}`,
      component: path.resolve('./src/templates/episodeTemplate.js'),
      context: {
        episode: epi,
      },
    })
  })
}
