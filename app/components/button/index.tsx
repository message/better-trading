import './style.css';
import React, { PropsWithChildren } from 'react';

function Button({ children }: PropsWithChildren) {
  return (
    <div className={'lalala'}>{children} - styles</div>
  );
}

export default Button;