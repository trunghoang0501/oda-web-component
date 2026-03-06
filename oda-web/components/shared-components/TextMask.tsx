import { MaskElement } from 'imask';
import React from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: (event: {
    target: { name: string; value?: string | unknown };
  }) => void;
  name: string;
}
export const NUMBER_SPACE_IN_TEXT_MASK = 2;
const TextMask = React.forwardRef<
  MaskElement,
  CustomProps & { mask?: string; overwrite?: boolean }
>(function textMaskCustom(props, ref) {
  const {
    onChange,
    name,
    mask = '00000000000000',
    overwrite = true,
    ...other
  } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      onAccept={(value) => {
        return onChange({ target: { name, value } });
      }}
      overwrite={overwrite}
    />
  );
});
export default TextMask;
