import React, {useState} from 'react';
import {
  Card,
  Layout,
  Page,
  FormLayout,
  TextField,
  AccountConnection,
  Button,
  BlockStack,
  Text,
  Box
} from '@shopify/polaris';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const [shopName, setShopName] = useState('My Awesome Store');
  const [email, setEmail] = useState('contact@example.com');

  return (
    <Page
      title="Settings"
      primaryAction={{content: 'Save changes', disabled: false}}
      secondaryActions={[{content: 'Discard'}]}
    >
      <Layout>
        <Layout.AnnotatedSection
          title="General Settings"
          description="Configure your store's basic information and contact details."
        >
          <Card>
            <FormLayout>
              <TextField
                label="App Name"
                value={shopName}
                onChange={setShopName}
                autoComplete="off"
              />
              <TextField
                type="email"
                label="Support Email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title="Account Connection"
          description="Manage your connection to external services."
        >
          <AccountConnection
            connected={false}
            action={{
              content: 'Connect Account',
              onAction: () => console.log('Connect'),
            }}
            details="No account connected"
            termsOfService={
              <p>
                By clicking Connect, you agree to our terms and conditions.
              </p>
            }
          />
        </Layout.AnnotatedSection>

        <Layout.Section>
          <Box paddingBlockEnd="400">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Danger Zone
                  </Text>
                  <Text as="p">
                    Once you delete your account, there is no going back. Please be certain.
                  </Text>
                  <Box>
                    <Button variant="primary" tone="critical">Delete Account</Button>
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
