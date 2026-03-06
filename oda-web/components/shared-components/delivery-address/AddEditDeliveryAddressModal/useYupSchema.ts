import { yupResolver } from '@hookform/resolvers/yup';
import { ResolverOptions } from 'react-hook-form';
import * as yup from 'yup';
import { translate } from '@/i18n/translate';
import { isTextStartedWithNumber, rulePhoneLength } from '@/utils';
import {
  COMPANY_PHONE_NUMBER_STARTED_WITHOUT_ZERO_MAX_LENGTH,
  COMPANY_PHONE_NUMBER_STARTED_WITHOUT_ZERO_MIN_LENGTH,
  COMPANY_PHONE_NUMBER_STARTED_WITH_ZERO_MAX_LENGTH,
  COMPANY_PHONE_NUMBER_STARTED_WITH_ZERO_MIN_LENGTH,
} from '@/utils/constants';
import { customRulePhone } from '@/utils/form';
import { NUMBER_SPACE_IN_TEXT_MASK } from '../../TextMask';
import { AddEditDeliveryAddressEnum } from './constants';
import { IAddEditDeliveryAddressForm } from './types';

interface IUseYupSchemaProps {
  data: IAddEditDeliveryAddressForm;
  context: ResolverOptions<IAddEditDeliveryAddressForm> | undefined;
  options: ResolverOptions<IAddEditDeliveryAddressForm>;
}

export const useYupSchema = (props: IUseYupSchemaProps) => {
  const { data, context, options } = props;

  const selectRulePhoneNumber = (item: IAddEditDeliveryAddressForm) => {
    const phone = item[AddEditDeliveryAddressEnum.Mobile];
    let isStartedWithZero = false;
    if (isTextStartedWithNumber(phone)) {
      isStartedWithZero = phone?.[0] === '0';
    } else {
      isStartedWithZero = false;
    }
    const validationPhone = () => {
      return isStartedWithZero
        ? COMPANY_PHONE_NUMBER_STARTED_WITH_ZERO_MIN_LENGTH +
            NUMBER_SPACE_IN_TEXT_MASK
        : COMPANY_PHONE_NUMBER_STARTED_WITHOUT_ZERO_MIN_LENGTH +
            NUMBER_SPACE_IN_TEXT_MASK;
    };

    return customRulePhone({
      name: translate('phone_number'),
      minLength: validationPhone(),
      maxLength: isStartedWithZero
        ? COMPANY_PHONE_NUMBER_STARTED_WITH_ZERO_MAX_LENGTH +
          NUMBER_SPACE_IN_TEXT_MASK
        : COMPANY_PHONE_NUMBER_STARTED_WITHOUT_ZERO_MAX_LENGTH +
          NUMBER_SPACE_IN_TEXT_MASK,
    });
  };

  const resolvers = yupResolver(
    yup.object().shape({
      [AddEditDeliveryAddressEnum.Name]: yup
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
      [AddEditDeliveryAddressEnum.Mobile]: selectRulePhoneNumber(data),
      [AddEditDeliveryAddressEnum.Area]: yup
        .object()
        .shape({
          city: yup
            .object()
            .nullable()
            .required(
              translate('validate:$field_required', {
                field: translate('city_district'),
              })
            ),
          district: yup
            .object()
            .nullable()
            .required(
              translate('validate:$field_required', {
                field: translate('district'),
              })
            ),
        })
        .nullable()
        .required(
          translate('validate:$field_required', {
            field: translate('city_district'),
          })
        ),
      [AddEditDeliveryAddressEnum.Address]: yup
        .string()
        .required(
          translate('validate:$field_required', {
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
      [AddEditDeliveryAddressEnum.IsDefault]: yup.boolean(),
    })
  );

  return resolvers(data, context, options);
};
