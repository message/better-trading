import React from 'react';

export interface BrandLinkProps {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  logoUrl: string;
  title: string;
}

const BrandLink: React.FC<BrandLinkProps> = ({ href, onClick, logoUrl, title }) => (
  <a className="bt-header__brand" href={href} onClick={onClick}>
    <img className="bt-header__logo" src={logoUrl} alt={title} />
    <div className="bt-header__title">{title}</div>
  </a>
);

export default BrandLink;

