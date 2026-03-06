import { useRouter } from 'next/router';
import { equals } from 'rambda';
import { memo, useCallback } from 'react';
import Back from '@/components/shared-components/Back';

interface BreadcrumbProps {
  id?: string | string[];
  title: string;
  link: string;
  tabName?: string;
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = (
  props: BreadcrumbProps
) => {
  const router = useRouter();

  const { id, title, link, tabName } = props;

  const handleBack = useCallback(async () => {
    await router.push(link);
  }, [link]);

  return (
    <Back
      size="sm"
      onClickBack={handleBack}
      title={`${title}${id ? ` / ${id}` : ''}${tabName ? ` / ${tabName}` : ''}`}
    />
  );
};

export const Breadcrumb = memo(BreadcrumbComponent, equals);
