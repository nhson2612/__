import React, {useEffect, useState} from 'react';
import {Button, Card, InlineStack, Text, Page, Layout, BlockStack} from '@shopify/polaris';
import './Home.css';
import useFetchApi from '@assets/hooks/api/useFetchApi';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const {data: statusData, loading, fetchApi} = useFetchApi({url: '/theme/status'});
  useEffect(() => {
    if (statusData && !loading) setEnabled(statusData.themeStatus === 'enabled');
  }, [statusData, loading]);
  return (
    <Page title="Home" fullWidth>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <Text as="h2" variant="bodyMd">
                  App status is{' '}
                  <Text as="span" fontWeight="bold">
                    {enabled ? 'enabled' : 'disabled'}
                  </Text>
                </Text>
                <Button
                  size="large"
                  variant="primary"
                  onClick={() => {
                    window.open(
                      'https://admin.shopify.com/store/dung-thanh-n/themes/156195356900/editor?context=apps',
                      '_blank'
                    );
                    setEnabled(!enabled);
                  }}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Button>
              </InlineStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
