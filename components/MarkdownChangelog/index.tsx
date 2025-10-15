import styles from './styles.module.scss';
import { marked } from 'marked';
import { useMemo } from 'react';

interface MarkdownChangelogProps {
  markdown: string;
  className?: string;
}

const MarkdownChangelog = ({ markdown, className }: MarkdownChangelogProps) => {
  const html = useMemo(() => marked.parse(markdown, { async: false }) as string, [markdown]);

  return (
    <div
      className={className ? `${styles.markdownChangelog} ${className}` : styles.markdownChangelog}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownChangelog;
