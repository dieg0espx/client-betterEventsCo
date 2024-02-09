import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const AddressAutoComplete = () => {
  const [address, setAddress] = useState('');

  const handleSelect = async (selectedAddress) => {
    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);
    console.log('Selected Address:', selectedAddress);
    console.log('Coordinates:', latLng);
    setAddress(selectedAddress);
  };

  return (
    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input {...getInputProps({ placeholder: 'Type address...' })} />
          <div>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const style = { backgroundColor: suggestion.active ? '#41b6e6' : '#fff' };
              return (
                <div {...getSuggestionItemProps(suggestion, { style })}>
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default AddressAutoComplete;
