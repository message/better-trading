// React version of the former Ember `changelog-banner` component.
// Migrated from: old-extension/app/pods/components/changelog-banner
// Responsibilities:
//  - Display a banner notifying the user about new changelog entries
//  - Allow the user to open a modal to view the changelog
//  - Allow the user to dismiss the banner (stored in local storage)
//  - Only show if there's a new changelog that hasn't been dismissed

import styles from './styles.module.scss';
import Button from '../Button';
import { useState, useEffect } from 'react';
import type React from 'react';

// TODO: Migrate these components from old-extension
// Temporary stubs for now

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div
    className="modal-overlay"
    onClick={onClose}
    onKeyDown={e => e.key === 'Escape' && onClose()}
    role="button"
    tabIndex={0}>
    <div className="modal-content" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} role="none">
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

const MarkdownChangelog: React.FC<{ markdown: string }> = ({ markdown }) => (
  <div dangerouslySetInnerHTML={{ __html: markdown }} />
);

// TODO: Migrate storage service to a hook
// Temporary stub for now
const useStorage = () => {
  const getLocalValue = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  };

  const setLocalValue = (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  };

  return { getLocalValue, setLocalValue };
};

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
  const storage = useStorage();
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalChangelogIsVisible, setModalChangelogIsVisible] = useState(false);

  useEffect(() => {
    if (!changelog) return;

    const dismissedChangelog = storage.getLocalValue(DISMISSED_CHANGELOG_STORAGE_KEY);
    if (dismissedChangelog === changelog.slug) {
      setIsDismissed(true);
    }
  }, [changelog, storage]);

  const bannerIsVisible = !isDismissed && !!changelog;

  const openChangelog = () => {
    setModalChangelogIsVisible(true);
  };

  const dismiss = () => {
    if (!changelog) return;

    storage.setLocalValue(DISMISSED_CHANGELOG_STORAGE_KEY, changelog.slug);
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

      {modalChangelogIsVisible && changelog && (
        <Modal title={modalTitle} onClose={dismiss}>
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
