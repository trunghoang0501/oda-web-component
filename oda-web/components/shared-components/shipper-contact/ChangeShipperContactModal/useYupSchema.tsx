import { yupResolver } from '@hookform/resolvers/yup';
import { ResolverOptions } from 'react-hook-form';
import * as yup from 'yup';
import { translate } from '@/i18n/translate';
import { isTextStartedWithNumber, rulePhoneLength } from '@/utils';
import { customRulePhone } from '@/utils/form';
import { IShipperContactForm, ShipperContactFieldsEnum } from './types';

interface IUseYupSchemaParams {
  formData: IShipperContactForm;
  context: ResolverOptions<IShipperContactForm> | undefined;
  options: ResolverOptions<IShipperContactForm>;
}

export const useYupSchema = (params: IUseYupSchemaParams) => {
  const { formData, context, options } = params;

  const selectRulePhoneNumber = (data: IShipperContactForm) => {
    const phone = data[ShipperContactFieldsEnum.Phone];
    let isStartedWithZero = false;
    if (isTextStartedWithNumber(phone || '')) {
      isStartedWithZero = phone?.[0] === '0';
    } else {
      isStartedWithZero = false;
    }

    const isRequired = !!data[ShipperContactFieldsEnum.Shipper];

    return customRulePhone({
      name: translate('phone_number'),
      minLength: isRequired ? rulePhoneLength(!!isStartedWithZero) : 0,
      maxLength: rulePhoneLength(!!isStartedWithZero),
      isRequired: false,
    });
  };

  const yupSchema = yup.object().shape({
    [ShipperContactFieldsEnum.Shipper]: yup
      .object()
      .nullable()
      .label(translate('shipper_name')),
    [ShipperContactFieldsEnum.Phone]: selectRulePhoneNumber(formData),
  });

  return yupResolver(yupSchema)(formData, context, options);
};
