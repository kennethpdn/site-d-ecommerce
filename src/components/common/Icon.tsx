import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IconProps {
  icon: IconProp;
  className?: string;
  spin?: boolean;
  size?: 'xs' | 'sm' | 'lg' | '1x' | '2x';
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Icon: React.FC<IconProps> = ({
  icon,
  className = '',
  spin = false,
  size,
  'aria-hidden': ariaHidden = true,
}) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      spin={spin}
      size={size}
      aria-hidden={ariaHidden}
    />
  );
};
