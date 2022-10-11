import * as React from 'react'

import * as mainStyle from '../style/main.module.css'

const Footer = (props) => {
  return (
    <footer className={mainStyle.site_footer}>
      <p>
        All content &copy;{' '}
        <a href="https://daringfireball.net/thetalkshow/">
          Daring Fireball's The Talk Show
        </a>
        .<br />
        Site and analysis by{' '}
        <a href="http://github.com/megagator/guests-of-the-talk-show">Mike</a>.
        <br />
        Transcriptions powered by{' '}
        <a href="https://github.com/openai/whisper">Whisper</a>.
      </p>
    </footer>
  )
}

export default Footer
