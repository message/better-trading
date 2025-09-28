import './style.css';
import React, { PropsWithChildren } from 'react';

const Button = ({ children }: PropsWithChildren) => (
  <div className={'bt-lalala'}>{children} - styles</div>
);

export default Button;