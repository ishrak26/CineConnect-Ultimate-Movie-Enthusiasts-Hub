import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from './input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

import React, { useEffect } from "react";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";
// import "../styles/ScrollBar.css";

export default function Search({ forwardedRef }) {
  const ref = useRef(null)
  const router = useRouter()
  const [value, setValue] = useState(router.query.query || '')

  const Dataset = [
    "Avengers", "The Godfather", "The Shawshank Redemption", "The Dark Knight", "The Lord of the Rings", "The Matrix", "Inception",
    "The Lion King", "The Terminator", "The Sixth Sense", "The Shining", "The Exorcist", "The Silence of the Lambs", "The Green Mile",
    "The Pianist", "The Prestige", "The Departed", "The Truman Show"]

  const [Data, setData] = useState([...Dataset].map((name, index) => ({
    name,
    code: index,
    selected: false,
  })));

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const resultElementRef = useRef(null);

  const filteredData = value
    ? Data.filter((info) =>
      info.name.toLowerCase().includes(value.toLowerCase())
    )
    : Data;

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: filteredData.length,
    isDropdownVisible: dropdownVisible,
    onEnter: (index) => {
      handleCheckboxChange(filteredData[index].code);
    },
    onEscape: () => {
      setDropdownVisible(false);
    },
  });

  const handleSearchChange = (e) => {
    setValue(e.target.value);
    setDropdownVisible(true);
  };

  const handleCheckboxChange = (code) => {
    setData(
      Data.map((info) =>
        info.code === code
          ? { ...info, selected: !info.selected }
          : info
      )
    );
  };

  const handleContainerBlur = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault()

    router.push({
      pathname: '/search',
      query: {
        ...router.query,
        query: value,
        page: 1,
      },
    })
  }

  return (
    <div
      onBlur={handleContainerBlur}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="relative mb-4"
    >
      <form action="submit" onSubmit={handleSubmit}>
        <InputGroup className="mt-8">
          <Input
            className={clsx(value && 'pr-14')}
            placeholder="eg. avengers"
            value={value}
            onChange={handleSearchChange}
            forwardedRef={forwardedRef || ref}
            hasIcon
            required
          />
          <InputLabel>Search Movies </InputLabel>
          {dropdownVisible && (
            <div
              ref={resultElementRef}
              className="absolute z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto hide-scrollbar"
            >
              {filteredData.length > 0 ? (
                filteredData.map((country, index) => (
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
          <SearchIcon className="input-icon text-2xl text-gray-500" />
          {value && (
            <button
              className="input-icon left-auto right-4"
              onClick={() => {
                setValue('')
                ref.current.focus()
              }}
              type="button"
            >
              <TimesIcon className="text-2xl" />
            </button>
          )}
        </InputGroup>
      </form>
    </div>
  )
}
