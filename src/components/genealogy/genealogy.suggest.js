import React, {useState} from 'react';
import Autosuggest from 'react-autosuggest';
import {withTranslation} from 'react-i18next';
import './genealogy.scss';

const Suggest = ({t, data, newPosition}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const onChange = (event, obj) => {
    let newValue = obj.newValue;
    setValue(newValue);
    if (obj.method === 'click') {
      for (let item of data) {
        if (item.login === newValue.trim().toLowerCase())
          newPosition(item.object);
      }
    }
  };

  const getSuggestions = (value) => {
    let inputValue = value.trim().toLowerCase();
    return inputValue.length < 3 ?
        [] : data.filter(
            (item) => item.login.slice(0, inputValue.length) === inputValue);
  };

  const onSuggestionsFetchRequested = ({value}) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: t('genealogy-search'),
    value,
    onChange: onChange,
  };

  const renderSuggestion = suggestion => (
      <div>
        {suggestion.login}
      </div>
  );

  const getSuggestionValue = suggestion => suggestion.login;

  return (<Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
  />);
};

export default withTranslation('Web')(Suggest);
