import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'

import darkStyle from './markdown-styles-dark.module.css'
import style from './markdown-styles.module.css'

interface IMDPreview {
  darkMode: boolean
  children?: string
}

const MDPreview = ({ darkMode, children = '' }: IMDPreview): JSX.Element => (
  <div className={darkMode ? darkStyle.reactMarkDown : style.reactMarkDown}>
    <ReactMarkdown
      linkTarget="_blank"
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
    >
      {children}
    </ReactMarkdown>
  </div>
)

export const MDTitle = ({ darkMode, children }: IMDPreview): JSX.Element => (
  <div className={darkMode ? darkStyle.reactMarkDown : style.reactMarkDown}>
    {children}
  </div>
)

export default MDPreview
