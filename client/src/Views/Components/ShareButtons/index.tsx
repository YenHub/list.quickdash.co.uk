import makeStyles from '@mui/styles/makeStyles'
import { isMobile } from 'react-device-detect'
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { DRAWER_WIDTH } from '../../../Services/Utils/constants'

const useStyles = makeStyles(
  () => ({
    shareIcons: {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'space-between',
      width: isMobile ? '100%' : `${DRAWER_WIDTH}px`,
      padding: `0 ${isMobile ? '30%' : '2.5em'}`,
      bottom: '10px',
    },
    icon: {
      marginRight: '0.5em',
    },
  }),
  { index: 1 },
)

const ShareButtons = (): JSX.Element => {
  const classes = useStyles()

  const { title, url, size } = {
    title: 'QuickList',
    url: 'https://list.quickdash.co.uk',
    size: 40,
  }

  return (
    <div className={classes.shareIcons}>
      <WhatsappShareButton
        title={title}
        separator=":: "
        url={url}
        className={classes.icon}
      >
        <WhatsappIcon size={size} round />
      </WhatsappShareButton>

      <FacebookShareButton quote={title} url={url} className={classes.icon}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>

      <PinterestShareButton
        url={url}
        media="https://github.com/YenHub/list.quickdash.co.uk/raw/master/PinterestDemo.png"
        windowWidth={1000}
        windowHeight={730}
      >
        <PinterestIcon size={size} round />
      </PinterestShareButton>
    </div>
  )
}

export default ShareButtons
