import React from 'react';
import {InlineStack, ResourceItem, Text, Box} from '@shopify/polaris';
import moment from 'moment';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import '../../../pages/Notifications/style.css';

/**
 * @param {Object} props
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Notification({
  id,
  firstName,
  city,
  country,
  productName,
  timestamp,
  productImage,
  settings
}) {
  const hideTimeAgo = settings?.display?.hideTimeAgo;
  const truncateContent = settings?.display?.truncateContent;
  const timeLabel = hideTimeAgo ? '' : moment(timestamp).fromNow();
  const fromDate = moment(timestamp).format('MMM DD, YYYY');

  return (
    <ResourceItem id={id}>
      <InlineStack align="space-between" blockAlign="start" gap="400">
        <Box>
          <NotificationPopup
            firstName={firstName}
            city={city}
            country={country}
            productName={productName}
            timestamp={timeLabel}
            productImage={productImage}
            displayCloseBtn={false}
            truncateContent={truncateContent}
          />
        </Box>
        <Box paddingBlockStart="200">
          <Text variant="bodySm" tone="subdued">
            {fromDate}
          </Text>
        </Box>
      </InlineStack>
    </ResourceItem>
  );
}
