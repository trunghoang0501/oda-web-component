import { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

export type INumericFormatCustomInputProps = Omit<
  NumericFormatProps,
  'getInputRef' | 'onValueChange'
> & {
  ref?: ((el: HTMLInputElement) => void) | React.Ref<HTMLInputElement>;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
};

/**
 * Ref:
 * - https://mui.com/material-ui/react-text-field/#integration-with-3rd-party-input-libraries
 * - https://codesandbox.io/s/0mjycw?file=/demo.tsx
 */
const NumericFormatCustomInput = forwardRef<
  HTMLInputElement,
  INumericFormatCustomInputProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, name, ...other } = props;

  return (
    <NumericFormat
      thousandSeparator
      valueIsNumericString
      allowNegative={false}
      decimalScale={0}
      allowLeadingZeros={false}
      isAllowed={(values) => {
        const numberValue = Number(values.value);
        return numberValue >= 0;
      }}
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
    />
  );
});

export default NumericFormatCustomInput;
