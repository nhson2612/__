import React from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Text,
  InlineStack,
  BlockStack,
  Badge,
  Thumbnail
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

  const productCards = productReport.map(item => {
    const { productId, product, click, conversion, conversionRate } = item;
    const title = product?.title || productId?.split('/').pop() || 'Unknown product';
    const imageUrl = product?.imageUrl || '';
    const imageAlt = product?.imageAlt || title;

    return (
      <LegacyCard key={productId || title}>
        <div className={styles.hesitationCard}>
          <div className={styles.hesitationRow}>
            <div className={styles.hesitationImage}>
              <Thumbnail source={imageUrl} alt={imageAlt} size="large" />
            </div>
            <div className={styles.hesitationContent}>
              <Text variant="bodyMd" fontWeight="bold" as="span">
                {title}
              </Text>
            </div>
            <div className={styles.hesitationMetricsInline}>
              <MetricItem label="Clicks" value={click} inline />
              <MetricItem label="Conversions" value={conversion} inline />
              <MetricItem label="CR" value={`${conversionRate}%`} inline />
            </div>
          </div>
        </div>
      </LegacyCard>
    );
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
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Product Performance">
            <BlockStack gap="4">
              {reportLoading ? (
                <Text variant="bodySm" as="p" color="subdued">
                  Loading report...
                </Text>
              ) : productReport.length === 0 ? (
                <div className={styles.emptyState}>
                  <Text variant="bodyMd" as="p">
                    No product data yet.
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Once users start clicking notifications, product insights will appear here.
                  </Text>
                </div>
              ) : (
                <div className={styles.hesitationGrid}>{productCards}</div>
              )}
            </BlockStack>
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

/**
 * @param {String} label
 * @param {String} value
 * @param {Boolean} inline
 * @return {React.JSX.Element}
 */
function MetricItem({ label, value, inline = false }) {
  return (
    <div className={inline ? styles.metricItemInline : styles.metricItem}>
      <Text variant="bodySm" as="span" color="subdued">
        {label}
      </Text>
      <Text variant="headingMd" as="span">
        {value}
      </Text>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

MetricItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  inline: PropTypes.bool
};
