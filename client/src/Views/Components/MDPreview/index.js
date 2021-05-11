import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import style from './markdown-styles.module.css';
import darkStyle from './markdown-styles-dark.module.css';

const MDPreview = props => (
    <div className={props.darkMode ? darkStyle.reactMarkDown : style.reactMarkDown }>
        <ReactMarkdown
            linkTarget="_blank"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[gfm]}
            children={props.children}
        />
    </div>
);

export const MDTitle = props => (
    <div className={props.darkMode ? darkStyle.reactMarkDown : style.reactMarkDown }>
        {props.children}
    </div>
);

export default MDPreview;