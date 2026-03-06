import { Ref } from 'react';
import {
  TableVirtuoso,
  TableVirtuosoHandle,
  TableVirtuosoProps,
} from 'react-virtuoso';

export function FlatVirtuosoTable<ItemData = any, Context = any>(
  props: TableVirtuosoProps<ItemData, Context> & {
    ref?: Ref<TableVirtuosoHandle> | undefined;
  }
) {
  const { components } = props;
  return (
    <TableVirtuoso
      {...props}
      components={{
        ...components,
        // eslint-disable-next-line react/no-unstable-nested-components
        FillerRow: ({ height }: any) => {
          return (
            <tr>
              <td colSpan={15} style={{ height, padding: 0, border: 0 }} />
            </tr>
          );
        },
      }}
    />
  );
}
