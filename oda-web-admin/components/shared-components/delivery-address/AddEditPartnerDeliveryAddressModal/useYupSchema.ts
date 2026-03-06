import { isTextStartedWithNumber, rulePhoneLength } from '@/utils';
import { IAddEditPartnerDeliveryAddressForm } from './types';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResolverOptions } from 'react-hook-form';
import * as yup from 'yup';
import { AddEditPartnerDeliveryAddressEnum } from './constants';
import { customRulePhone } from '@/utils/form';
import { translate } from '@/i18n/translate';

interface IUseYupSchemaProps {
  data: IAddEditPartnerDeliveryAddressForm;
  context: ResolverOptions<IAddEditPartnerDeliveryAddressForm> | undefined;
  options: ResolverOptions<IAddEditPartnerDeliveryAddressForm>;
}

export const useYupSchema = (props: IUseYupSchemaProps) => {
  const { data, context, options } = props;

  const selectRulePhoneNumber = (item: IAddEditPartnerDeliveryAddressForm) => {
    const phone = item[AddEditPartnerDeliveryAddressEnum.Mobile];
    let isStartedWithZero = false;
    if (isTextStartedWithNumber(phone)) {
      isStartedWithZero = phone?.[0] === '0';
    } else {
      isStartedWithZero = false;
    }
    return customRulePhone({
      name: translate('phone_number'),
      minLength: rulePhoneLength(!!isStartedWithZero),
      maxLength: rulePhoneLength(!!isStartedWithZero),
    });
  };

  const resolvers = yupResolver(
    yup.object().shape({
      [AddEditPartnerDeliveryAddressEnum.Name]: yup
        .string()
        .max(
          64,
          translate('dialog:$field_can_contain_up_to_$max_characters', {
            field: translate('name'),
            max: 64,
          })
        )
        .nullable()
        .required(translate('enter_your_name')),
      [AddEditPartnerDeliveryAddressEnum.Mobile]: selectRulePhoneNumber(data),
      [AddEditPartnerDeliveryAddressEnum.Area]: yup
        .object()
        .shape({
          city: yup
            .object()
            .nullable()
            .required(
              translate('dialog:$field_required', {
                field: translate('city_district'),
              })
            ),
          district: yup
            .object()
            .nullable()
            .required(
              translate('dialog:$field_required', {
                field: translate('district'),
              })
            ),
        })
        .nullable()
        .required(
          translate('dialog:$field_required', {
            field: translate('city_district'),
          })
        ),
      [AddEditPartnerDeliveryAddressEnum.Address]: yup
        .string()
        .required(
          translate('dialog:$field_required', {
            field: translate('address'),
          })
        )
        .label(translate('address'))
        .max(
          255,
          translate('dialog:$field_can_contain_up_to_$max_characters', {
            field: translate('address'),
            max: 255,
          })
        ),
      [AddEditPartnerDeliveryAddressEnum.DeliveryFee]: yup.number().typeError(
        translate('validate:please_enter_valid_$field', {
          field: translate('delivery_fee'),
        })
      ),
      [AddEditPartnerDeliveryAddressEnum.IsDefault]: yup.boolean(),
    })
  );

  return resolvers(data, context, options);
};
