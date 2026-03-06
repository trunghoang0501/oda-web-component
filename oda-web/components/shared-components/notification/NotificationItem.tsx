import { Box, MenuItemProps, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { useSnackbar } from 'notistack';
import React, { ElementType, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReadNotificationMutation } from '@/apis';
import { INotification, INotificationGeneral } from '@/types';
import {
  DATE_FORMAT_HH_MM_DD_MM_YYYY,
  LanguageEnum,
  formatDate,
  generatePartnerDetailUrl,
  generateProductDetailUrl,
  getInventoryWarehouseDetailUrl,
  getNotificationIcon,
  getPurchaseOrderListUrl,
  getReturnBuyOrderDetailUrl,
  getReturnBuyOrderListUrl,
  getReturnSellOrderDetailUrl,
  getReturnSellOrderListUrl,
  getSaleOrderListUrl,
  getStaffManagementListUrl,
  getSuggestionDetailUrl,
  getTransferWarehouseDetailUrl,
  hexToRGBA,
} from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
import { downloadFile } from '@/utils/file';
import {
  AvatarStyled,
  MenuItemStyled,
  MenuItemSubtitleStyled,
  MenuItemTitleStyled,
} from './style';

interface INotificationItemProps {
  item: INotification;
  sx?: MenuItemProps['sx'];
  language: LanguageEnum;
}

export const YOU_CAN_DOWNLOAD_THE_PRODUCT_AS_EXCEL_FILE = 15;

const NotificationItem = ({ item, sx, language }: INotificationItemProps) => {
  const { type, is_read: isRead, content, created_at: createdAt } = item;

  const theme = useTheme();
  const { t } = useTranslation();
  const [readNotification] = useReadNotificationMutation();
  const { enqueueSnackbar } = useSnackbar();
  const Icon: ElementType = useMemo(() => getNotificationIcon(type.id), [type]);

  const getNameByLanguage = (_item: INotificationGeneral) => {
    let name;

    switch (language) {
      case LanguageEnum.en_US:
        name = _item.name_en;
        break;
      case LanguageEnum.vi_VN:
        name = _item.name_vn;
        break;
      case LanguageEnum.ko_KR:
        name = _item.name_ko;
        break;
      default:
        break;
    }

    return name ?? _item.name;
  };

  const notificationContent = useMemo(() => {
    const { params, template } = content;

    if (params.order) {
      const { order, partner } = params;
      let url = order.url_web ?? '';
      if (url === '/buy/') {
        url = getPurchaseOrderListUrl();
      } else if (url === '/sell/') {
        url = getSaleOrderListUrl();
      }

      let templateOrder = template.replaceAll(
        `\${order_id}`,
        `<a href="${url}/${order?.id}">${order?.id}</a>`
      );

      // if have partner
      if (partner) {
        templateOrder = templateOrder.replaceAll(
          `\${partner_name}`,
          `<a href="${generatePartnerDetailUrl(partner?.id || '')}">${
            partner?.name
          }</a>`
        );
      }

      return templateOrder;
    }
    if (params.return_order) {
      const { return_order: returnOrder, partner } = params;
      let url = returnOrder.url_web ?? '';
      if (url === '/buy/') {
        url = getReturnBuyOrderDetailUrl(returnOrder?.id);
      } else if (url === '/sell/') {
        url = getReturnSellOrderDetailUrl(returnOrder?.id);
      }

      let templateOrder = template.replaceAll(
        `\${return_order_id}`,
        `<a href="${url}">${returnOrder?.id}</a>`
      );

      // if have partner
      if (partner) {
        templateOrder = templateOrder.replaceAll(
          `\${partner_name}`,
          `<a href="${generatePartnerDetailUrl(partner?.id || '')}">${
            partner?.name
          }</a>`
        );
      }

      return templateOrder;
    }
    if (params.partner) {
      const { partner, new_role: newRole, old_role: oldRole } = params;
      let templatePartner = template.replaceAll(
        `\${partner_name}`,
        `<a href="${generatePartnerDetailUrl(partner?.id || '')}">${
          partner?.name
        }</a>`
      );

      // if have newRole
      if (newRole) {
        templatePartner = templatePartner.replaceAll(
          `\${new_role_name}`,
          `<b>${getNameByLanguage(newRole)}</b>`
        );
      }

      // if have oldRole
      if (oldRole) {
        templatePartner = templatePartner.replaceAll(
          `\${old_role_name}`,
          `<b>${getNameByLanguage(oldRole)}</b>`
        );
      }

      return templatePartner;
    }
    if (params.product) {
      return template.replaceAll(
        `\${product_name}`,
        `<a href="${generateProductDetailUrl({
          id: params.product?.id!,
        })}">${getNameByLanguage(params.product)}</a>`
      );
    }
    if (params.user) {
      return template.replaceAll(
        `\${user_name}`,
        `<a href="${getStaffManagementListUrl()}">${params.user?.name}</a>`
      );
    }
    if (params.destinationCompany) {
      let templateDestination = template.replaceAll(
        `\${destination_company_name}`,
        `<a>${params.destinationCompany?.destination_company_name}</a>`
      );

      // Handle transfer_id if present
      if (params.destinationCompany?.transfer_id) {
        templateDestination = templateDestination.replaceAll(
          `\${transfer_id}`,
          `<a href="${getTransferWarehouseDetailUrl(
            params.destinationCompany.transfer_id
          )}">${params.destinationCompany.transfer_id}</a>`
        );
      }

      return templateDestination;
    }

    if (params.sourceCompany) {
      let templateSource = template.replaceAll(
        `\${source_company_name}`,
        `<a>${params.sourceCompany?.source_company_name}</a>`
      );

      // Handle transfer_id if present
      if (params.sourceCompany?.transfer_id) {
        templateSource = templateSource.replaceAll(
          `\${transfer_id}`,
          `<a href="${getTransferWarehouseDetailUrl(
            params.sourceCompany.transfer_id
          )}">${params.sourceCompany.transfer_id}</a>`
        );
      }

      return templateSource;
    }
    if (params.warehouse) {
      return template.replaceAll(
        `\${warehouse_name}`,
        `<a href="${getInventoryWarehouseDetailUrl(
          params.warehouse?.id || ''
        )}">${params.warehouse?.name}</a>`
      );
    }
    if (params.download_product) {
      return template.replaceAll(
        `\${download_product}`,
        `<a href="${
          params.download_product.url_web
        }/product-management" download="${params.download_product.name}">${t(
          'download'
        )}</a>`
      );
    }
    if (
      params.excel &&
      params.content === YOU_CAN_DOWNLOAD_THE_PRODUCT_AS_EXCEL_FILE
    ) {
      return `${template} <span class="downloadError">${t('failed')}</span>`;
    }
    if (params.excel) {
      if (!template) return '';
      return template.replaceAll(
        `{excel}`,
        `<a class="download-excel-link" data-url="${params.excel?.url}">${t(
          'download_here'
        )}</a>`
      );
    }
    if (params.suggestion && 'suggestion' in params) {
      const { suggestion } = params;
      let templateSuggestion = template;

      // Replace suggestion_id with link
      if (suggestion?.id) {
        const suggestionUrl = getSuggestionDetailUrl(suggestion.id);
        templateSuggestion = templateSuggestion.replaceAll(
          `\${suggestion_id}`,
          `<a href="${suggestionUrl}">${suggestion.id}</a>`
        );
      }

      // Replace product_list (already formatted)
      if (suggestion?.product_list) {
        templateSuggestion = templateSuggestion.replaceAll(
          `\${product_list}`,
          suggestion.product_list
        );
      }

      return templateSuggestion;
    }

    return template;
  }, [content, language, t]);

  const handleReadNotification = async (
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Add click handler for excel downloads
    const currentNotificationItem = event.currentTarget;
    const downloadLink = currentNotificationItem.querySelector(
      '.download-excel-link'
    );
    if (downloadLink) {
      const url = downloadLink.getAttribute('data-url');
      if (url) {
        downloadFile(url, url);
      }
    }

    if (!item.is_read) {
      try {
        await readNotification({
          id: item.id,
        });
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, {
            variant: 'error',
          });
        }
      }
    }
  };

  return (
    <MenuItemStyled
      className="notificationItem"
      sx={sx}
      onClick={handleReadNotification}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <AvatarStyled
          sx={{
            color: isRead
              ? theme.palette.text.secondary
              : theme.palette.common.white,
            backgroundColor: isRead
              ? hexToRGBA(theme.palette.customColors.readNotiBg, 0.8)
              : hexToRGBA(theme.palette.primary.main, 0.8),
            [mediaMobileMax]: {
              width: theme.spacing(8),
              height: theme.spacing(8),
            },
          }}
        >
          <Icon sx={{ width: theme.spacing(5), height: theme.spacing(5) }} />
        </AvatarStyled>
        <Box
          sx={{
            ml: 4,
            flex: '1 1',
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MenuItemTitleStyled
              sx={{
                [mediaMobileMax]: {
                  fontSize: theme.spacing(3.5),
                },
              }}
            >
              {t(type.name || '')}
            </MenuItemTitleStyled>
            <Typography
              fontSize={theme.spacing(3)}
              color={theme.palette.customColors.tableText}
              sx={{
                [mediaMobileMax]: {
                  fontSize: theme.spacing(2.5),
                },
              }}
            >
              {formatDate(createdAt, DATE_FORMAT_HH_MM_DD_MM_YYYY)}
            </Typography>
          </Box>
          <MenuItemSubtitleStyled
            dangerouslySetInnerHTML={{ __html: notificationContent }}
            sx={{
              '.downloadError': {
                color: theme.palette.error.main,
                textDecoration: 'underline',
              },
              [mediaMobileMax]: {
                fontSize: theme.spacing(3.5),
              },
            }}
          />
        </Box>
      </Box>
    </MenuItemStyled>
  );
};

export default NotificationItem;
