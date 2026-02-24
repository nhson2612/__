import {h} from 'preact';
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
    <div class="Avava-SP__Wrapper fadeInUp animated">
      <div class="Avava-SP__Inner">
        <div class="Avava-SP__Container">
          <div class="Avada-SP__CloseButton">
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
          <a href="#" class="Avava-SP__LinkWrapper">
            <div
              class="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage || 'https://via.placeholder.com/150'})`
              }}
            ></div>
            <div class="Avada-SP__Content">
              <div class="Avada-SP__Title">
                {firstName} in {city}, {country}
              </div>
              <div class="Avada-SP__Subtitle">purchased {displayProductName}</div>
              <div class="Avada-SP__Footer">
                {timestamp}{' '}
                <span class="uni-blue">
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

export default NotificationPopup;
