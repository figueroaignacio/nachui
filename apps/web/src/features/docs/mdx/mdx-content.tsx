import { MDXContent as CCMDXContent } from '@content-collections/mdx/react';
import { mdxComponents } from './mdx-components';

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export const MDXContent = ({ code, components }: MDXProps) => {
  return <CCMDXContent code={code} components={{ ...mdxComponents, ...components }} />;
};
