import React from 'react';
import PropTypes from 'prop-types';
import './NoticationPopup.scss';
import {Button} from '@shopify/polaris';
import {XIcon} from '@shopify/polaris-icons';

const NotificationPopup = ({
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  timestamp = 'a day ago',
  productImage = 'https://product.hstatic.net/200000410665/product/giay-the-thao-l82201-5_8cedfe64846b4bc6bef0f09105c8db3d.jpg',
  onClose = () => {},
  displayCloseBtn = true,
  truncateContent = false
}) => {
  const displayProductName =
    truncateContent && productName.length > 16 ? `${productName.substring(0, 16)}...` : productName;

  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <div
            className="Avada-SP__CloseButton"
            style={{display: displayCloseBtn ? 'block' : 'none'}}
          >
            <Button
              icon={XIcon}
              variant="tertiary"
              size="micro"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            />
          </div>
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>Purchased {displayProductName}</div>
              <div className={'Avada-SP__Footer'}>
                {timestamp}{' '}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" />✔ by AVADA
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {
  firstName: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  productName: PropTypes.string,
  timestamp: PropTypes.string,
  productImage: PropTypes.string,
  onClose: PropTypes.func,
  displayCloseBtn: PropTypes.bool,
  truncateContent: PropTypes.bool
};

export default NotificationPopup;
