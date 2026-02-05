import React from 'react';
// eslint-disable-next-line no-unused-vars
import {h} from 'preact';
import PropTypes from 'prop-types';
import './NotificationPopup.scss';

const NotificationPopup = ({
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket',
  timestamp = 'just now',
  productImage = '',
  onClose = () => {},
  truncateContent = false
}) => {
  const displayProductName =
    truncateContent && productName.length > 16 ? `${productName.substring(0, 16)}...` : productName;

  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <div className="Avada-SP__CloseButton">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <svg viewBox="0 0 20 20" style={{width: '12px', height: '12px', fill: '#637381'}}>
                <path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293a1 1 0 001.414-1.414L11.414 10z"></path>
              </svg>
            </button>
          </div>
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage || 'https://via.placeholder.com/150'})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>purchased {displayProductName}</div>
              <div className={'Avada-SP__Footer'}>
                {timestamp}{' '}
                <span className="uni-blue">
                  <span style={{marginRight: '4px'}}>✓</span> by Avada
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
  truncateContent: PropTypes.bool
};

export default NotificationPopup;
