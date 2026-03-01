import React from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Text,
  InlineStack,
  BlockStack,
  Badge,
  Thumbnail,
  IndexTable
} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import styles from './style.module.css';
import PropTypes from 'prop-types';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Analytics() {
  const { data: stats, loading } = useFetchApi({
    url: '/analytics/stats',
    defaultData: {
      view: 0,
      click: 0,
      conversion: 0,
      totalRevenue: 0,
      conversionRate: 0
    }
  });

  const { data: productReport, loading: reportLoading } = useFetchApi({
    url: '/analytics/hesitation-report',
    defaultData: []
  });



  return (
    <Page title="Analytics" subtitle="Product performance from notification interactions">
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <BlockStack gap="4">
              <Text variant="headingMd" as="h2">
                Performance Overview
              </Text>
              <div className={styles.statsGrid}>
                <StatCard title="Total Clicks" value={stats.click} loading={loading} />
                <StatCard title="Conversions" value={stats.conversion} loading={loading} />
                <StatCard
                  title="Total Revenue"
                  value={`$${stats.totalRevenue.toFixed(2)}`}
                  loading={loading}
                />
              </div>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <LegacyCard title="Conversion Summary" sectioned>
            <BlockStack gap="4">
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">
                  Conversions
                </Text>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {stats.conversion}
                </Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">
                  Conversion Rate
                </Text>
                <Badge tone="success">{stats.conversionRate}%</Badge>
              </InlineStack>
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">
                  Click Through Rate
                </Text>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {stats.ctr}%
                </Text>
              </InlineStack>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Product Performance">
            {reportLoading ? (
              <BlockStack gap="4" padding="4">
                <Text variant="bodySm" as="p" color="subdued">
                  Loading report...
                </Text>
              </BlockStack>
            ) : productReport.length === 0 ? (
              <BlockStack gap="4" padding="4">
                <div className={styles.emptyState}>
                  <Text variant="bodyMd" as="p">
                    No product data yet.
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Once users start clicking notifications, product insights will appear here.
                  </Text>
                </div>
              </BlockStack>
            ) : (
              <IndexTable
                resourceName={{ singular: 'product', plural: 'products' }}
                itemCount={productReport.length}
                headings={[
                  { title: '' },
                  { title: 'Clicks' },
                  { title: 'Conversions' },
                  { title: 'Conversion Rate' }
                ]}
                selectable={false}
              >
                {productReport.map((item, index) => {
                  const { productId, product, click, conversion, conversionRate } = item;
                  const title = product?.title || productId?.split('/').pop() || 'Unknown product';
                  const imageUrl = product?.imageUrl || '';
                  const imageAlt = product?.imageAlt || title;

                  return (
                    <IndexTable.Row id={productId || String(index)} key={productId || String(index)} position={index}>
                      <IndexTable.Cell>
                        <InlineStack gap="4" blockAlign="center">
                          <Thumbnail source={imageUrl} alt={imageAlt} size="small" />
                          <Text variant="bodyMd" fontWeight="bold" as="span">
                            {title}
                          </Text>
                        </InlineStack>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{click}</IndexTable.Cell>
                      <IndexTable.Cell>{conversion}</IndexTable.Cell>
                      <IndexTable.Cell>{`${conversionRate}%`}</IndexTable.Cell>
                    </IndexTable.Row>
                  );
                })}
              </IndexTable>
            )}
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

/**
 * @param {String} title
 * @param {String} value
 * @param {Boolean} loading
 * @return {React.JSX.Element}
 */
function StatCard({ title, value, loading }) {
  return (
    <div className={styles.statCard}>
      <LegacyCard sectioned>
        <BlockStack gap="2">
          <Text variant="headingSm" as="h6" color="subdued">
            {title}
          </Text>
          <Text variant="headingLg" as="p">
            {loading ? '...' : value}
          </Text>
        </BlockStack>
      </LegacyCard>
    </div>
  );
}


