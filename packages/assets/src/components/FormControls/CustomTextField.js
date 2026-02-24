import React, {useId} from 'react';
import PropTypes from 'prop-types';
import './FormControls.css';

export default function CustomTextField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  autoComplete,
  multiline
}) {
  const id = useId();
  const rows = typeof multiline === 'number' ? multiline : undefined;
  const isMultiline = !!multiline;

  return (
    <div className="avada-field">
      <label className="avada-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="avada-field__control">
        {isMultiline ? (
          <textarea
            id={id}
            className="avada-field__input"
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            rows={rows}
          />
        ) : (
          <input
            id={id}
            className="avada-field__input"
            type="text"
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
        )}
      </div>
      {helpText ? <div className="avada-field__help">{helpText}</div> : null}
    </div>
  );
}

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  autoComplete: PropTypes.string,
  multiline: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};
