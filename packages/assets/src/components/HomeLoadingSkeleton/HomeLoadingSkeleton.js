import {SkeletonPage, Layout, LegacyCard, SkeletonBodyText} from '@shopify/polaris';
import React from 'react';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
export default function HomeLoadingSkeleton() {
  return (
    <SkeletonPage fullWidth>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <SkeletonBodyText />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
