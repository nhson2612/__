import React from 'react';
import PropTypes from 'prop-types';
import {Page, Layout, InlineStack, BlockStack, Text} from '@shopify/polaris';

/**
 * Renders the page content with a title, subtitle, and additional content.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the section.
 * @param {string} props.subtitle - The subtitle of the section.
 * @param {React.ReactNode} props.actions - The action to render.
 * @param {React.ReactNode} props.content - The main content to render.
 * @return {JSX.Element} The rendered page layout.
 */
export default function PageContent({title, subtitle, content, actions}) {
  if (!title) {
    throw new Error('Title are required for PageContent');
  }

  return (
    <Page fullWidth>
      <BlockStack gap="1000">
        <Layout>
          <Layout.Section>
            <InlineStack gap="400" wrap={false} blockAlign="end">
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  {title}
                </Text>
                {subtitle ? (
                  <Text as="p" variant="bodySm" tone="subdued">
                    {subtitle}
                  </Text>
                ) : null}
              </BlockStack>
              {actions}
            </InlineStack>
          </Layout.Section>
        </Layout>
        {content}
      </BlockStack>
    </Page>
  );
}

PageContent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  content: PropTypes.node,
  actions: PropTypes.node
};
