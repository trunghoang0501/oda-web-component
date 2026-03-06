import { Chip, ChipProps, Stack, StackProps, useTheme } from '@mui/material';
import { ICategory } from '@/types';

export interface ICategoryTagsProps {
  categories: ICategory[][];
  onChange: (value: ICategory[][]) => void;
  containerProps?: StackProps;
  chipProps?: ChipProps;
}

export const CategoryTags = (props: ICategoryTagsProps) => {
  const { categories, onChange, containerProps, chipProps } = props;
  const theme = useTheme();

  const handleDelete = (index: number) => {
    const newCategoryList = categories.filter((_, idx) => idx !== index);

    onChange(newCategoryList);
  };

  return (
    <Stack direction="row" gap={2} {...containerProps}>
      {categories.map((cats, index) => {
        const name = cats.map((cat) => cat.name).join(' > ');

        return (
          <Chip
            key={name}
            label={name}
            size="small"
            onDelete={() => handleDelete(index)}
            sx={{
              fontSize: theme.spacing(3),
              ...chipProps?.sx,
            }}
            {...chipProps}
          />
        );
      })}
    </Stack>
  );
};
