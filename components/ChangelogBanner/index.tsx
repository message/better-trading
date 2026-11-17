// React version of the former Ember `changelog-banner` component.
// Migrated from: old-extension/app/pods/components/changelog-banner
// Responsibilities:
//  - Display a banner notifying the user about new changelog entries
//  - Allow the user to open a modal to view the changelog
//  - Allow the user to dismiss the banner (stored in local storage)
//  - Only show if there's a new changelog that hasn't been dismissed

import styles from './styles.module.scss';
import Button from '../Button';
import MarkdownChangelog from '../MarkdownChangelog';
import Modal from '../Modal';
import { getLocalValue, setLocalValue } from '@/utils/storage';
import { useState, useEffect } from 'react';
import type React from 'react';

// Constants
const DISMISSED_CHANGELOG_STORAGE_KEY = 'dismissed-changelog';

interface ChangelogData {
  slug: string;
  markdown: string;
}

interface ChangelogBannerProps {
  version: string;
  changelog?: ChangelogData;
  // Localized strings
  noticeText?: string;
  modalButtonLabel?: string;
  modalTitle?: string;
  dismissButtonLabel?: string;
}

/**
 * ChangelogBanner displays a notification about new changelog entries.
 * It can be dismissed and shows a modal with the full changelog when clicked.
 */
const ChangelogBanner: React.FC<ChangelogBannerProps> = ({
  version,
  changelog,
  noticeText = `Better Trading has been updated to version ${version}!`,
  modalButtonLabel = 'View Changelog',
  modalTitle = `What's new in version ${version}`,
  dismissButtonLabel = 'Got it!',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalChangelogIsVisible, setModalChangelogIsVisible] = useState(false);

  useEffect(() => {
    if (!changelog) return;

    const dismissedChangelog = getLocalValue(DISMISSED_CHANGELOG_STORAGE_KEY);
    if (dismissedChangelog === changelog.slug) {
      setIsDismissed(true);
    }
  }, [changelog]);

  const bannerIsVisible = !isDismissed && !!changelog;

  const openChangelog = () => {
    setModalChangelogIsVisible(true);
  };

  const dismiss = () => {
    if (!changelog) return;

    setLocalValue(DISMISSED_CHANGELOG_STORAGE_KEY, changelog.slug);
    setIsDismissed(true);
    setModalChangelogIsVisible(false);
  };

  if (!bannerIsVisible) {
    return null;
  }

  return (
    <>
      <div className={styles.changelogBanner}>
        {noticeText}

        <Button type="button" theme="blue" label={modalButtonLabel} onClick={openChangelog} icon="info-circle" />
      </div>

      {changelog && (
        <Modal title={modalTitle} onClose={dismiss} isOpen={modalChangelogIsVisible}>
          <MarkdownChangelog markdown={changelog.markdown} />

          <Button
            className={styles.dismissButton}
            type="button"
            theme="gold"
            label={dismissButtonLabel}
            onClick={dismiss}
            icon="times"
          />
        </Modal>
      )}
    </>
  );
};

export type { ChangelogData, ChangelogBannerProps };
export default ChangelogBanner;
