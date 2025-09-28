import './style.css';
import React, { useCallback, useEffect, useState } from 'react';
import { cx } from '@/app/lib/classnames';
import logoUrl from '@/app/assets/images/logo.png';
import { deleteLocalValue, getLocalValue, setLocalValue } from '@/app/lib/storage';
import { RouteHash } from '@/app/lib/routes';
import CollapseButton from './CollapseButton';
import BrandLink from './BrandLink';
import ToggleRouteButton from './ToggleRouteButton';
import ExpandButton from './ExpandButton';

type HeaderRoute = 'root' | 'about';

// Accept href props as generic strings for flexibility, but default to enum values.
// This keeps existing external API stable while removing magic strings internally.
type HeaderProps = {
  currentRoute?: HeaderRoute;
  onNavigate?: (route: HeaderRoute) => void;
  className?: string;
};

const COLLAPSED_STORAGE_KEY = 'side-panel-collapsed';

const getStoredCollapsedState = () => Boolean(getLocalValue(COLLAPSED_STORAGE_KEY));

const Header: React.FC<HeaderProps> = ({
                                         currentRoute = 'root',
                                         onNavigate,
                                         className,
                                       }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(getStoredCollapsedState);

  useEffect(() => {
    const body = typeof document !== 'undefined' ? document.body : null;
    if (!body) return;

    body.classList.toggle('bt-is-collapsed', isCollapsed);
  }, [isCollapsed]);

  const handleCollapse = useCallback(() => {
    setLocalValue(COLLAPSED_STORAGE_KEY, 'true');
    setIsCollapsed(true);
  }, []);

  const handleExpand = useCallback(() => {
    deleteLocalValue(COLLAPSED_STORAGE_KEY);
    setIsCollapsed(false);
  }, []);

  const handleBrandClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!onNavigate) return;

      event.preventDefault();
      onNavigate('root');
    },
    [onNavigate],
  );

  const targetRoute: HeaderRoute = currentRoute === 'root' ? 'about' : 'root';
  const targetHref = targetRoute === 'root' ? RouteHash.Root : RouteHash.About;
  const targetIcon = targetRoute === 'root' ? 'times' : 'info-circle';
  const toggleLabelKey = targetRoute === 'root' ? 'header.show_main' : 'header.show_about';

  const handleToggleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!onNavigate) return;

      event.preventDefault();
      onNavigate(targetRoute);
    },
    [onNavigate, targetRoute],
  );

  return (
    <>
      <div className={cx('bt-header', className)}>
        <CollapseButton onClick={handleCollapse} label={i18n.t('header.collapse')} />

        <BrandLink
          href={RouteHash.Root}
          onClick={handleBrandClick}
          logoUrl={logoUrl}
          title={i18n.t('general.title')}
        />

        <ToggleRouteButton
          href={targetHref}
          icon={targetIcon}
          label={i18n.t(toggleLabelKey)}
          onClick={handleToggleClick}
        />
      </div>

      <ExpandButton
        visible={true}
        onClick={handleExpand}
        label={i18n.t('header.expand')}
        logoUrl={logoUrl}
        title={i18n.t('general.title')}
      />
    </>
  );
};

export default Header;
