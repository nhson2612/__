import React from 'react';
import {InlineStack, ResourceItem, Text, Box} from '@shopify/polaris';
import {relativeTime} from '@assets/utils/app';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import '../../../pages/Notifications/style.css';

/**
 * @param {Object} props
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Notification({id, message, action, date, imageUrl, onClose = () => {}}) {
  const timeLabel = relativeTime(date);
  const fromDate = formatDateOnly(date);

  return (
    <ResourceItem id={id} persistActions>
      <InlineStack align="space-between" blockAlign="start" gap="400">
        <Box>
          <NotificationPopup
            productName={message}
            timestamp={timeLabel}
            productImage={imageUrl}
            onClose={onClose}
          />
        </Box>
        <Box paddingBlockStart="200">
          <Text variant="bodySm" tone="subdued">
            From {fromDate}
          </Text>
        </Box>
      </InlineStack>
    </ResourceItem>
  );
}

/**
 * @param {string|Date} value
 * @return {string}
 */
function formatDateOnly(value) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
