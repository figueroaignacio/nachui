import React from 'react';
import { Flex, type FlexProps } from './flex';

interface StackProps extends Omit<FlexProps, 'direction'> {
  direction?: 'column' | 'row';
}

const Stack = ({
  as: Component = 'div',
  direction = 'column',
  className,
  ref,
  ...props
}: StackProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <Flex as={Component} ref={ref} direction={direction} className={className} {...props} />;
};

Stack.displayName = 'Stack';

export { Stack };
export type { StackProps };
