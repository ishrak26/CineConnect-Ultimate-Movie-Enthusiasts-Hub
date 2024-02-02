import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import mockCountries from "@/mocks/mockSearchData";
import { Country } from "@/types/data";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import SearchInput from "../common/SearchInput";
import "@/styles/ScrollBar.css";

const SyncSearch: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([...mockCountries]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const resultElementRef = useRef<HTMLDivElement>(null);
  const filteredCountries = searchInput
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : countries;

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: filteredCountries.length,
    isDropdownVisible: dropdownVisible,
    onEnter: (index: number) => {
      handleCheckboxChange(filteredCountries[index].code);
    },
    onEscape: () => {
      setDropdownVisible(false);
    },
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setDropdownVisible(true);
  };

  const handleCheckboxChange = (code: string) => {
    setCountries(
      countries.map((country) =>
        country.code === code
          ? { ...country, selected: !country.selected }
          : country
      )
    );
  };

  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && resultElementRef.current) {
      const focusedElement = resultElementRef.current.children[focusedIndex];
      focusedElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  return (
    <div
      onBlur={handleContainerBlur}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="relative mb-4"
    >
      <SearchInput
        id="sync-search"
        label="Sync Search"
        placeholder="Type to begin searching"
        value={searchInput}
        onChange={handleSearchChange}
      />
      {dropdownVisible && (
        <div
          ref={resultElementRef}
          className="absolute z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto hide-scrollbar"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                }}
                className="flex w-80 overflow-hidden items-center p-2 border-b cursor-pointer hover:bg-black hover:bg-opacity-10"
              >
                <div className="flex-grow mr-4">
                  <div className="truncate w-60">
                    <span>{country.name}</span>
                  </div>
                </div>
                <input
                  className="form-checkbox h-5 w-5 text-blue-600"
                  type="checkbox"
                  checked={country.selected}
                  onChange={() => handleCheckboxChange(country.code)}
                />
              </div>
            ))
          ) : (
            <div className="w-80 text-gray-500 p-2">No results were found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncSearch;