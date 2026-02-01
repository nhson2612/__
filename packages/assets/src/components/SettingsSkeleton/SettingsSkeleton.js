import React from 'react';
import {
  Layout,
  LegacyCard,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  BlockStack
} from '@shopify/polaris';

/**
 * SettingsSkeleton component
 * Renders a loading state for the Settings page
 * @return {React.JSX.Element}
 */
export default function SettingsSkeleton() {
  return (
    <SkeletonPage primaryAction title="Settings" fullWidth>
      <Layout>
        {/* Preview Section Skeleton */}
        <Layout.Section variant="oneThird">
          <LegacyCard sectioned>
            <BlockStack gap="400" align="center">
              <div
                style={{
                  height: '100px',
                  width: '100%',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '8px'
                }}
              />
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        {/* Settings Form Skeleton */}
        <Layout.Section>
          <LegacyCard>
            {/* Fake Tabs */}
            <div style={{padding: '1rem', borderBottom: '1px solid #dfe3e8'}}>
              <div style={{display: 'flex', gap: '20px'}}>
                <div
                  style={{
                    width: '60px',
                    height: '20px',
                    backgroundColor: '#dfe3e8',
                    borderRadius: '4px'
                  }}
                />
                <div
                  style={{
                    width: '60px',
                    height: '20px',
                    backgroundColor: '#f4f6f8',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <LegacyCard.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />

                <div style={{height: '20px'}} />

                <SkeletonDisplayText size="small" />
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                  <div
                    style={{
                      width: '48%',
                      height: '80px',
                      backgroundColor: '#f4f6f8',
                      borderRadius: '8px'
                    }}
                  />
                  <div
                    style={{
                      width: '48%',
                      height: '80px',
                      backgroundColor: '#f4f6f8',
                      borderRadius: '8px'
                    }}
                  />
                </div>

                <div style={{height: '20px'}} />

                <SkeletonBodyText lines={3} />
              </TextContainer>
            </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

SettingsSkeleton.propTypes = {};
