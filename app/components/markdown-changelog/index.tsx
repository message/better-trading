import './style.css';
import React, { useMemo } from 'react';
import { marked } from 'marked';
import { cx } from '../../lib/classnames';

type MarkdownChangelogProps = {
  markdown: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const MarkdownChangelog: React.FC<MarkdownChangelogProps> = ({ markdown, className, ...rest }) => {
  const html = useMemo(() => marked.parse(markdown ?? ''), [markdown]);

  return (
    <div
      className={cx('bt-markdown-changelog', className)}
      {...rest}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownChangelog;
