import React, {useId} from 'react';
import PropTypes from 'prop-types';
import './FormControls.css';

/**
 * @param {String} label
 * @param {String} options
 * @param {String} value
 * @param {Function} onChange
 * @return {React.JSX.Element}
 * @constructor
 */
export default function CustomSelect({label, options, value, onChange}) {
  const id = useId();
  return (
    <div className="avada-field">
      <label className="avada-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="avada-field__control">
        <select
          id={id}
          className="avada-field__select"
          value={value}
          onChange={event => onChange(event.target.value)}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
