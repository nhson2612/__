import React, {useState} from 'react';
import {Button, Card, InlineStack, Text, Page, Layout, BlockStack} from '@shopify/polaris';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);

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
                <Button size="large" variant="primary" onClick={() => setEnabled(!enabled)}>
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
