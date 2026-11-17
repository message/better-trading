import styles from './styles.module.scss';
import Button from '../Button';
import FormCheckbox from '../FormCheckbox';
import MarkdownChangelog from '../MarkdownChangelog';
import GithubIcon from '@/assets/icons/brands/github.svg?react';
import { useItemResults } from '@/hooks/useItemResults';
import classnames from 'classnames';
import type { ChangelogData } from '../ChangelogBanner';

interface Enhancer {
  slug: string;
  isEnabled: boolean;
}

interface PageAboutProps {
  appVersion: string;
  githubUrl: string;
  discordUrl?: string;
  chaosRecipeOverlayUrl?: string;
  currentChangelog?: ChangelogData;
  enhancersTitle: string;
  /** Resolves the display title of an enhancer from its slug */
  getEnhancerTitle: (slug: string) => string;
  githubTitle: string;
  githubDescription: string;
  githubButtonLabel: string;
  creditsTitle: string;
  /** Trusted static HTML */
  creditsDescription: string;
  disclaimer: string;
  className?: string;
}

const useEnhancers = () => {
  const { disabledEnhancerSlugs, setDisabledEnhancerSlugs, getEnhancerSlugs } = useItemResults();

  const enhancers: Enhancer[] = getEnhancerSlugs().map(slug => ({
    slug,
    isEnabled: !disabledEnhancerSlugs.includes(slug),
  }));

  const toggleDisabledEnhancerSlug = (slug: string, isEnabled: boolean) => {
    let updatedDisabledEnhancerSlugs = [...disabledEnhancerSlugs];

    if (isEnabled) {
      updatedDisabledEnhancerSlugs = updatedDisabledEnhancerSlugs.filter(disabledSlug => disabledSlug !== slug);
    } else {
      updatedDisabledEnhancerSlugs.push(slug);
    }

    setDisabledEnhancerSlugs(updatedDisabledEnhancerSlugs);
  };

  return { enhancers, toggleDisabledEnhancerSlug };
};

/**
 * PageAbout component - About page with changelog, enhancers, and credits
 * Migrated from old-extension/app/pods/components/page/about
 */
const PageAbout = ({
  appVersion,
  githubUrl,
  currentChangelog,
  enhancersTitle,
  getEnhancerTitle,
  githubTitle,
  githubDescription,
  githubButtonLabel,
  creditsTitle,
  creditsDescription,
  disclaimer,
  className,
}: PageAboutProps) => {
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
          <h1 className={styles.sectionTitle}>{enhancersTitle}</h1>

          {enhancers.map(enhancer => (
            <FormCheckbox
              key={enhancer.slug}
              className={styles.enhancerCheckbox}
              value={enhancer.isEnabled}
              label={getEnhancerTitle(enhancer.slug)}
              onChange={newValue => toggleDisabledEnhancerSlug(enhancer.slug, newValue)}
            />
          ))}
        </section>

        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>{githubTitle}</h1>

          <p className={styles.sectionDescription}>{githubDescription}</p>

          <Button href={githubUrl} theme="blue" icon={GithubIcon} label={githubButtonLabel} />
        </section>

        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>{creditsTitle}</h1>

          <p className={styles.sectionDescription} dangerouslySetInnerHTML={{ __html: creditsDescription }} />
        </section>
      </div>

      <p className={styles.disclaimer}>{disclaimer}</p>

      <p className={styles.version}>{appVersion}</p>
    </div>
  );
};

export default PageAbout;
export type { PageAboutProps, Enhancer };
