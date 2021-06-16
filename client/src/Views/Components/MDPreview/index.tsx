import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import style from './markdown-styles.module.css';
import darkStyle from './markdown-styles-dark.module.css';

interface IMDPreview {
    darkMode: boolean,
    children?: string,
}

const MDPreview = ({ darkMode, children = '' }: IMDPreview): JSX.Element => (
    <div className={darkMode ? darkStyle.reactMarkDown : style.reactMarkDown}>
        <ReactMarkdown
            linkTarget="_blank"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[gfm]}
            children={children}
        />
    </div>
);

export const MDTitle = ({ darkMode, children }: IMDPreview): JSX.Element => (
    <div className={darkMode ? darkStyle.reactMarkDown : style.reactMarkDown}>
        {children}
    </div>
);

export default MDPreview;