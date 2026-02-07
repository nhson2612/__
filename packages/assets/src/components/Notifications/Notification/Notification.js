import React from 'react';
import PropTypes from 'prop-types';
import {InlineStack, ResourceItem, Text, Box} from '@shopify/polaris';
import moment from 'moment';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import '../../../pages/Notifications/style.module.css';

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
  settings,
  onClose
}) {
  const hideTimeAgo = settings?.display?.hideTimeAgo;
  const truncateContent = settings?.display?.truncateContent;
  const timeLabel = hideTimeAgo ? '' : moment(timestamp).fromNow();
  const fromDate = moment(timestamp)
    .format('MMM DD, YYYY')
    .split(', ');
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
            displayCloseBtn={true}
            truncateContent={truncateContent}
            onClose={() => onClose(id)}
          />
        </Box>
        <Box paddingBlockStart="200">
          <Text variant="bodySm" tone="subdued" as="strong">
            From {fromDate[0]},<br />
            <span style={{display: 'block', textAlign: 'right'}}>{fromDate[1]}</span>
          </Text>
        </Box>
      </InlineStack>
    </ResourceItem>
  );
}

Notification.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  firstName: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  productImage: PropTypes.string,
  settings: PropTypes.shape({
    display: PropTypes.shape({
      hideTimeAgo: PropTypes.bool,
      truncateContent: PropTypes.bool
    })
  }),
  onClose: PropTypes.func
};

Notification.defaultProps = {
  productImage: '',
  settings: {},
  onClose: () => {}
};
