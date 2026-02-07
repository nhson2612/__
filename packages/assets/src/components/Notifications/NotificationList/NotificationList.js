import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, ResourceList} from '@shopify/polaris';
import Notification from '../Notification/Notification';
import ConfirmationDialog from '@assets/components/ConfirmationDialog/ConfirmationDialog';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';

/**
 * @param {Object} props
 * @param {Array} props.items
 * @return {JSX.Element}
 * @constructor
 */
export default function NotificationList({
  items = [],
  settings = {},
  sortValue = 'DATE_MODIFIED_DESC',
  onSortChange,
  pagination,
  onDismiss
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {handleDelete: deleteNotification} = useDeleteApi({url: '/notifications'});
  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const bulkActions = [
    {
      content: 'Delete All',
      onAction: () => {
        setDialogOpen(true);
      }
    }
  ];

  const renderItem = item => {
    return <Notification {...item} settings={settings} onClose={() => onDismiss(item.id)} />;
  };

  const handleDelete = async () => {
    console.log('>>>>>>>>>>>>>>>> Deleting items:', selectedItems);
    for (const itemId of selectedItems) {
      await deleteNotification({id: itemId});
      onDismiss(itemId);
    }
    setDialogOpen(false);
  };

  console.log('NotificationList items:', items);

  return (
    <Fragment>
      <Card padding="0">
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          bulkActions={bulkActions}
          sortValue={sortValue}
          sortOptions={[
            {label: 'Newest Update', value: 'DATE_MODIFIED_DESC'},
            {label: 'Oldest Update', value: 'DATE_MODIFIED_ASC'}
          ]}
          onSortChange={onSortChange}
          pagination={pagination}
        />
      </Card>
      <ConfirmationDialog
        open={dialogOpen}
        title="Xóa dữ liệu"
        message="Hành động này không thể hoàn tác. Bạn chắc chắn chứ?"
        confirmText="Xóa luôn"
        cancelText="Thôi"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </Fragment>
  );
}

NotificationList.propTypes = {
  items: PropTypes.array.isRequired,
  settings: PropTypes.object,
  sortValue: PropTypes.string,
  onSortChange: PropTypes.func,
  pagination: PropTypes.object,
  onDismiss: PropTypes.func
};

NotificationList.defaultProps = {
  items: [],
  settings: {},
  sortValue: 'DATE_MODIFIED_DESC',
  onSortChange: undefined,
  pagination: undefined,
  onDismiss: () => {}
};
