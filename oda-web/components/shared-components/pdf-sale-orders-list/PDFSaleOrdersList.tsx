import { useTheme } from '@mui/material';
import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useLocale from '@/hooks/useLocale';
import { VendorStatusEnum } from '@/types';
import { IOrderInPDFFile } from '@/types/order';
import {
  DATE_FORMAT_DD_MMM_YYYY_SLASH,
  DATE_FORMAT_DD_MM_YYYY__HH_MM,
  formatDate,
  formatMoney,
  formatNumberKeepDecimal,
} from '@/utils';
import { PDFDocumentStyles } from '../../../containers/sales/order-list/styles';

interface IPDFSaleOrdersListProps {
  orders: IOrderInPDFFile[];
  dateRange: string;
}

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

export const PDFSaleOrdersList = ({
  orders,
  dateRange,
}: IPDFSaleOrdersListProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = PDFDocumentStyles(theme);
  const locale = useLocale();

  const renderText = (text: ReactNode) => (
    <Text style={styles.text}>{text}</Text>
  );

  const renderFee = (label: string, amount: string) => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {renderText(label)}
      {renderText(amount)}
    </View>
  );

  const page = (
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) =>
        `${t('page')} ${pageNumber} / ${totalPages}`
      }
      fixed
    />
  );

  const getVendorName = (order: IOrderInPDFFile) => {
    if (order.vendor?.status.id === VendorStatusEnum.LOCAL) {
      return order.vendor?.name || '';
    }

    if (order.vendor?.is_sync) {
      return order.vendor?.remote?.name || '';
    }

    return `${order.vendor?.name || ''} / ${order.vendor?.remote?.name || ''}`;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {dateRange && <Text style={styles.orderId}>{dateRange}</Text>}
        <View style={styles.table}>
          <View style={{ ...styles.row, ...styles.header }}>
            <View style={{ ...styles.col, ...styles.orderNumberCol }}>
              {renderText(t('order_number'))}
            </View>
            <View style={{ ...styles.col, ...styles.partnerCol }}>
              {renderText(t('buyer'))}
            </View>
            <View style={{ ...styles.col, ...styles.timeCol }}>
              {renderText(t('order_time_expected_delivery_time'))}
            </View>
            <View style={{ ...styles.col, ...styles.deliveredDateCol }}>
              {renderText(t('delivered_date'))}
            </View>
            <View style={{ ...styles.col, ...styles.createdByCol }}>
              {renderText(t('created_by'))}
            </View>
            <View style={{ ...styles.col, ...styles.statusCol }}>
              {renderText(t('status'))}
            </View>
            <View style={{ ...styles.col, ...styles.numberOfProductCol }}>
              {renderText(t('no_product'))}
            </View>
            <View style={{ ...styles.col, ...styles.amountCol }}>
              {renderText(t('pages:order:amount'))}
            </View>
            <View style={{ ...styles.col, ...styles.noteCol }}>
              {renderText(t('note'))}
            </View>
          </View>
          {orders.map((order, index) => (
            <View wrap={false} key={index} style={styles.row}>
              <View style={{ ...styles.col, ...styles.orderNumberCol }}>
                {renderText(order.id)}
              </View>
              <View style={{ ...styles.col, ...styles.partnerCol }}>
                {renderText(getVendorName(order))}
              </View>
              <View style={{ ...styles.col, ...styles.timeCol }}>
                {renderText(
                  `${
                    order.order_date
                      ? formatDate(
                          order.order_date,
                          DATE_FORMAT_DD_MMM_YYYY_SLASH,
                          locale
                        )
                      : ''
                  } - ${
                    order.expect_delivery
                      ? formatDate(
                          order.expect_delivery,
                          DATE_FORMAT_DD_MM_YYYY__HH_MM
                        )
                      : ''
                  }`
                )}
              </View>
              <View style={{ ...styles.col, ...styles.deliveredDateCol }}>
                {renderText(
                  order.delivery_at
                    ? formatDate(
                        order.delivery_at,
                        DATE_FORMAT_DD_MMM_YYYY_SLASH,
                        locale
                      )
                    : '-'
                )}
              </View>
              <View style={{ ...styles.col, ...styles.createdByCol }}>
                {renderText(order.created_by?.name || '')}
              </View>
              <View style={{ ...styles.col, ...styles.statusCol }}>
                {renderText(order.status?.name || '')}
              </View>
              <View style={{ ...styles.col, ...styles.numberOfProductCol }}>
                {renderText(order.products?.length)}
              </View>
              <View style={{ ...styles.col, ...styles.amountCol }}>
                {renderFee(t('pages:order:amount'), formatMoney(order.amount))}
                {renderFee(t('vat'), formatMoney(order.vat_amount))}
                {renderFee(t('shipping_fee'), formatMoney(order.delivery_fee))}
                {renderFee(t('total_amount'), formatMoney(order.total))}
              </View>
              <View style={{ ...styles.col, ...styles.noteCol }}>
                {renderText(order.note || '')}
              </View>
            </View>
          ))}
        </View>

        {orders.map((order, index) => (
          <View break key={index}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.orderId}>#{order.id}</Text>
              <Text style={styles.orderId}>
                {t('status')}: {order.status?.name}
              </Text>
            </View>

            <View style={styles.orderInfoContainer}>
              <View style={{ width: '60%' }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  {renderText(`${t('buyer')}: `)}
                  {renderText(getVendorName(order) || '-')}
                </View>
                {renderText(
                  `${t('delivery_address')}: ${[
                    order.delivery_address?.address,
                    order.delivery_address?.district.name,
                    order.delivery_address?.city.name,
                  ]
                    .filter((item) => item)
                    .join(' - ')}`
                )}
                {renderText(
                  `${t('buyer_number_contact')}: ${
                    order.contact?.mobile || '-'
                  }`
                )}
              </View>
              <View style={{ width: '40%' }}>
                {renderText(
                  `${t('order_date')}: ${
                    order.order_date
                      ? formatDate(
                          order.order_date,
                          DATE_FORMAT_DD_MM_YYYY__HH_MM
                        )
                      : '-'
                  }`
                )}
                {renderText(
                  `${t('expected_delivery_date')}: ${
                    order.expect_delivery
                      ? formatDate(
                          order.expect_delivery,
                          DATE_FORMAT_DD_MM_YYYY__HH_MM
                        )
                      : '-'
                  }`
                )}
                {renderText(
                  `${t('delivered_date')}: ${
                    order.delivery_at
                      ? formatDate(
                          order.delivery_at,
                          DATE_FORMAT_DD_MM_YYYY__HH_MM
                        )
                      : '-'
                  }`
                )}
              </View>
            </View>

            <View style={{ ...styles.table, marginTop: 20 }}>
              <View style={{ ...styles.row, ...styles.header }}>
                <View style={{ ...styles.col, ...styles.skuCol }}>
                  {renderText(t('sku'))}
                </View>
                <View style={{ ...styles.col, ...styles.productNameCol }}>
                  {renderText(t('product_name'))}
                </View>
                <View style={{ ...styles.col, ...styles.specCol }}>
                  {renderText(t('spec/uom'))}
                </View>
                <View style={{ ...styles.col, ...styles.quantityCol }}>
                  {renderText(t('quantity'))}
                </View>
                <View style={{ ...styles.col, ...styles.vatCol }}>
                  {renderText(t('vat'))}
                </View>
                <View style={{ ...styles.col, ...styles.unitPriceCol }}>
                  {renderText(t('unit_price'))}
                </View>
                <View style={{ ...styles.col, ...styles.productAmountCol }}>
                  {renderText(t('pages:order:amount'))}
                </View>
              </View>

              {order.products.map((product, id) => (
                <View wrap={false} key={id} style={styles.row}>
                  <View style={{ ...styles.col, ...styles.skuCol }}>
                    {renderText(product.sku || '')}
                  </View>
                  <View style={{ ...styles.col, ...styles.productNameCol }}>
                    {renderText(product.name)}
                  </View>
                  <View style={{ ...styles.col, ...styles.specCol }}>
                    {renderText(t(product.uom?.name || ''))}
                  </View>
                  <View style={{ ...styles.col, ...styles.quantityCol }}>
                    {renderText(formatNumberKeepDecimal(product.quantity))}
                  </View>
                  <View style={{ ...styles.col, ...styles.vatCol }}>
                    {renderText(`${product.vat}%`)}
                  </View>
                  <View style={{ ...styles.col, ...styles.unitPriceCol }}>
                    {renderText(formatMoney(product.price))}
                  </View>
                  <View style={{ ...styles.col, ...styles.productAmountCol }}>
                    {renderText(t(formatMoney(product.amount)))}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <View style={styles.totalWrapper}>
                <View style={styles.totalInfo}>
                  {renderText(t('pages:order:amount'))}
                  {renderText(t('vat'))}
                  {renderText(t('shipping_fee'))}
                  {renderText(t('grand_total'))}
                </View>
                <View style={styles.totalInfo}>
                  {renderText(formatMoney(order.amount))}
                  {renderText(formatMoney(order.vat_amount))}
                  {renderText(formatMoney(order.delivery_fee))}
                  {renderText(formatMoney(order.total))}
                </View>
              </View>
            </View>
          </View>
        ))}

        {page}
      </Page>
    </Document>
  );
};
