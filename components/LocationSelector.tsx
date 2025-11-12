
import React from 'react';
import type { Location } from '../types';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ locations, selectedLocation, onLocationChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = locations.find(loc => loc.name === event.target.value);
    if (newLocation) {
      onLocationChange(newLocation);
    }
  };

  return (
    <div className="relative">
      <select
        value={selectedLocation.name}
        onChange={handleChange}
        className="w-64 appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 text-gray-800 dark:text-gray-200"
      >
        {locations.map(location => (
          <option key={location.name} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default LocationSelector;
