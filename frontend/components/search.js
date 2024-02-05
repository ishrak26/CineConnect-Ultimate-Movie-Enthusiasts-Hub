import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from './input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

import React, { useEffect } from "react";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";

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
      handleSelection(filteredData[index].name);
    },
    onEscape: () => {
      setDropdownVisible(false);
    },
  });

  const handleSearchChange = (e) => {
    setValue(e.target.value);
    setDropdownVisible(true);
  };

  const handleSelection = (name) => {
    setValue(name);
    setDropdownVisible(false); // Close the dropdown after selection
    ref.current.focus(); // Focus the search input after selection
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
              className="absolute mx-10 z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto hide-scrollbar"
            >
              {filteredData.length > 0 ? (
                filteredData.map((Data, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                    }}
                    className="flex w-80 overflow-hidden items-center p-2 border-b cursor-pointer hover:bg-primary-600 hover:bg-opacity-70"
                    onClick={() => handleSelection(Data.name)}
                  >
                    <div className="flex-grow mr-4">
                      <div className="truncate w-60">
                        <span>{Data.name}</span>
                      </div>
                    </div>
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

// export default function Search({ forwardedRef }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const router = useRouter();
//   const searchRef = useRef(null);

//   const fetchSearchResults = async (query) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`YOUR_API_ENDPOINT?search=${query}`);
//       const data = await response.json();
//       setSearchResults(data);
//     } catch (error) {
//       console.error('Failed to fetch search results', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Debounce fetchSearchResults to avoid excessive API calls
//   const debouncedFetchSearchResults = useRef(debounce(fetchSearchResults, 300)).current;

//   useEffect(() => {
//     if (searchQuery.length > 2) { // Only fetch if query length is more than 2 characters
//       debouncedFetchSearchResults(searchQuery);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery, debouncedFetchSearchResults]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     router.push(`/search?query=${searchQuery}`);
//   };

//   const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
//     itemCount: searchResults.length,
//     isDropdownVisible: dropdownVisible,
//     onEnter: (index) => {
//       const selectedItem = searchResults[index];
//       router.push(`/details/${selectedItem.id}`); // Assuming each search result has an ID
//       setDropdownVisible(false);
//     },
//     onEscape: () => setDropdownVisible(false),
//   });

//   return (
//     <div className="relative" onBlur={() => setDropdownVisible(false)} tabIndex={-1} onKeyDown={handleKeyDown}>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onFocus={() => setDropdownVisible(true)}
//           className="search-input"
//           ref={forwardedRef || searchRef}
//         />
//         {loading && <div>Loading...</div>}
//         {dropdownVisible && (
//           <div className="search-results-dropdown">
//             {searchResults.map((result, index) => (
//               <div key={result.id} className={`result-item ${index === focusedIndex ? 'focused' : ''}`}>
//                 {result.name}
//               </div>
//             ))}
//           </div>
//         )}
//         <button type="submit"><SearchIcon /></button>
//         {searchQuery && (
//           <button
//             type="button"
//             onClick={() => {
//               setSearchQuery('');
//               searchRef.current.focus();
//             }}
//           >
//             <TimesIcon />
//           </button>
//         )}
//       </form>
//     </div>
//   );
// }
