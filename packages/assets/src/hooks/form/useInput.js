import {useState} from 'react';

/**
 * Manage a simple input object state.
 * @param {object | null} [defaultState=null]
 * @returns {[object | null, function(string, any): void, function(object | null): void]}
 */
export default function useInput(defaultState = null) {
  const [input, setInput] = useState(defaultState);

  /**
   * Update a key in the input state.
   * @param {string} key
   * @param {any} value
   * @return {void}
   */
  const handleInputChange = (key, value) => setInput(prev => ({...prev, [key]: value}));

  return [input, handleInputChange, setInput];
}
