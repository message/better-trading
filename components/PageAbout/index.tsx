import styles from './styles.module.scss';
import Button from '../Button';
import FormCheckbox from '../FormCheckbox';
import MarkdownChangelog from '../MarkdownChangelog';
import classnames from 'classnames';
import { useState } from 'react';

interface Enhancer {
  slug: string;
  isEnabled: boolean;
  translationKey: string;
}

interface Changelog {
  slug: string;
  markdown: string;
}

interface PageAboutProps {
  appVersion: string;
  githubUrl: string;
  discordUrl?: string;
  chaosRecipeOverlayUrl?: string;
  currentChangelog?: Changelog;
  // Translation function
  t: (key: string, options?: { htmlSafe?: boolean }) => string;
  className?: string;
}

// TODO: Replace with actual item-results service once migrated
// Stub for enhancers functionality
const useEnhancers = () => {
  const [disabledEnhancerSlugs, setDisabledEnhancerSlugs] = useState<string[]>([]);

  const getEnhancerSlugs = (): string[] =>
    // TODO: Implement actual enhancer slugs retrieval from service
    ['bulk-price', 'item-age', 'collapsed-cards', 'highlight-corrupted', 'highlight-ilvl'];
  const enhancers: Enhancer[] = getEnhancerSlugs().map(slug => ({
    slug,
    isEnabled: !disabledEnhancerSlugs.includes(slug),
    translationKey: `page.about.enhancers.${slug}`,
  }));

  const toggleDisabledEnhancerSlug = (slug: string, isEnabled: boolean) => {
    let updatedDisabledEnhancerSlugs = [...disabledEnhancerSlugs];

    if (isEnabled) {
      updatedDisabledEnhancerSlugs = updatedDisabledEnhancerSlugs.filter(disabledSlug => disabledSlug !== slug);
    } else {
      updatedDisabledEnhancerSlugs.push(slug);
    }

    setDisabledEnhancerSlugs(updatedDisabledEnhancerSlugs);
    // TODO: Persist to storage/service
  };

  return { enhancers, toggleDisabledEnhancerSlug };
};

/**
 * PageAbout component - About page with changelog, enhancers, and credits
 * Migrated from old-extension/app/pods/components/page/about
 */
const PageAbout = ({ appVersion, githubUrl, currentChangelog, t, className }: PageAboutProps) => {
  const { enhancers, toggleDisabledEnhancerSlug } = useEnhancers();

  return (
    <div className={classnames(className)}>
      <div className={styles.sections}>
        {currentChangelog && (
          <section className={styles.section}>
            <MarkdownChangelog markdown={currentChangelog.markdown} />
          </section>
        )}

        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>{t('page.about.enhancers.title')}</h1>

          {enhancers.map(enhancer => (
            <FormCheckbox
              key={enhancer.slug}
              className={styles.enhancerCheckbox}
              value={enhancer.isEnabled}
              label={t(enhancer.translationKey)}
              onChange={newValue => toggleDisabledEnhancerSlug(enhancer.slug, newValue)}
            />
          ))}
        </section>

        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>{t('page.about.github.title')}</h1>

          <p className={styles.sectionDescription}>{t('page.about.github.description')}</p>

          <Button href={githubUrl} theme="blue" icon="github" label={t('page.about.github.button')} />
        </section>

        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>{t('page.about.credits.title')}</h1>

          <p
            className={styles.sectionDescription}
            dangerouslySetInnerHTML={{ __html: t('page.about.credits.description', { htmlSafe: true }) }}
          />
        </section>
      </div>

      <p className={styles.disclaimer}>{t('page.about.disclaimer')}</p>

      <p className={styles.version}>{appVersion}</p>
    </div>
  );
};

export default PageAbout;
export type { PageAboutProps, Enhancer, Changelog };
