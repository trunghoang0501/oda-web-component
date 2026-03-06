import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  AutocompleteRenderOptionState,
  Box,
  Checkbox,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  HTMLAttributes,
  ReactNode,
  UIEvent,
  forwardRef,
  useCallback,
} from 'react';
import { ItemProps, Virtuoso } from 'react-virtuoso';
import { isScrollToBottom } from '@/utils';
import { OFFSET_BOTTOM_TRIGGER_LOAD_MORE } from '@/utils/constants';
import { BoxListStyled } from '../styles';
import { useVirtualizeAutocompleteElementContext } from '../useVirtualizeAutocompleteElementContext';

type DataOption = [
  HTMLAttributes<HTMLLIElement>,
  any,
  any,
  boolean,
  AutocompleteRenderOptionState,
  ((option: any) => ReactNode) | undefined
];

const Listbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(
  ({ children, ...rest }, ref) => {
    const itemData = children as DataOption[];
    const { isLoadingMore, isFetching, onFetchMore, sx } =
      useVirtualizeAutocompleteElementContext();
    const theme = useTheme();

    const handleScroll = useCallback(
      (event: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget;
        if (
          isScrollToBottom(
            scrollTop,
            scrollHeight,
            offsetHeight,
            OFFSET_BOTTOM_TRIGGER_LOAD_MORE
          ) &&
          onFetchMore &&
          !isLoadingMore
        ) {
          onFetchMore();
        }
      },
      [onFetchMore, isLoadingMore]
    );

    const renderOption = (index: number) => {
      const [
        props,
        option,
        renderCustomOption,
        showCheckbox,
        state,
        getOptionLabel,
      ] = itemData[index];

      if (renderCustomOption) {
        return renderCustomOption(props, option, state);
      }

      return (
        <Box component="li" {...props}>
          {showCheckbox && (
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              sx={{ mr: 2 }}
              checked={state.selected}
            />
          )}
          {getOptionLabel ? getOptionLabel(option) : option.name}
        </Box>
      );
    };

    const renderListItem = ({
      children: itemChildren,
      ...props
    }: ItemProps) => (
      <Box {...props} {...rest}>
        {itemChildren}
      </Box>
    );

    const footerComponent = useCallback(() => {
      if (!isLoadingMore) {
        return <div />;
      }

      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={theme.spacing(8)} />
        </Box>
      );
    }, [isLoadingMore]);

    return (
      <BoxListStyled
        className="Listbox"
        ref={ref}
        onScroll={handleScroll}
        sx={sx}
      >
        {isFetching && !isLoadingMore ? (
          <Box display="flex" justifyContent="center" py={20}>
            <CircularProgress size={theme.spacing(8)} />
          </Box>
        ) : (
          <Virtuoso
            data={itemData}
            itemContent={renderOption}
            overscan={20}
            components={{
              Item: renderListItem,
              Footer: footerComponent,
            }}
          />
        )}
      </BoxListStyled>
    );
  }
);

Listbox.displayName = 'Listbox';
export default Listbox;
