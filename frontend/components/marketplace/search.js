// import React from 'react'
// import { useState } from 'react'
// import Router from 'next/router'

// function Search() {
//   const [input, setInput] = useState('')
//   const [data, setData] = useState([])

//   const handleChange = async (e) => {
//     setInput(e.target.value)
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_APIURL}/items?name_contains=${input}`
//     )
//     const data = await res.json()
//     setData(data)
//   }

//   return (
//     <div className="flex relative group md:ml-auto justify-between pr-4 place-items-center flex-grow h-full rounded-3xl bg-white">
//       <div className="flex-grow"></div>
//       <input
//         onChange={handleChange}
//         className="text-sm group pl-12 rounded-3xl p-2.5 focus:outline-none text-cusblack"
//         type="text"
//         placeholder="Search product"
//       />
//       <div className="p-5 shadow-lg hidden duration-100 group-focus-within:inline group-active:inline top-11 bg-white absolute rounded-2xl w-full z-20">
//         {data.length ? (
//           data
//             .filter((i, idx) => idx < 4)
//             .map((item, idx) => (
//               <div onClick={() => Router.push('/product/' + item.slug)}>
//                 <div
//                   key={idx}
//                   className="p-2 flex place-items-center cursor-pointer text-xs font-light text-cusblack hover:bg-gray-100 active:bg-gray-200"
//                 >
//                   <span>
//                     <img
//                       src={item.prop[0].image[0]}
//                       className="w-7 h-7 mr-1 rounded-lg"
//                       alt=""
//                     />
//                   </span>
//                   {item.name}
//                 </div>
//               </div>
//             ))
//         ) : (
//           <p className="text-xs text-cusblack font-light">No item found</p>
//         )}
//       </div>
//       <svg
//         className="w-4 h-4 text-gray-400"
//         fill="currentColor"
//         viewBox="0 0 20 20"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           fillRule="evenodd"
//           d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </div>
//   )
// }

// export default Search
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from '@components/input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

import React, { useEffect } from 'react'
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation'

import debounce from 'lodash.debounce'

export default function Search({ forwardedRef }) {
  const ref = useRef(null)
  const router = useRouter()
  const [value, setValue] = useState(router.query.query || '')

  const [dropdownVisible, setDropdownVisible] = useState(false)

  const resultElementRef = useRef(null)

  const [filteredData, setFilteredData] = useState([])

  const fetchResults = async () => {
    if (!value) return setFilteredData([])
    const limit = 10

    const values = value
      .split(',')
      .flatMap((v) => v.split(' '))
      .filter((v) => v.trim() !== '')

    // Construct query parameters
    let queryParams = 'limit=10&offset=0&'
    let tags = 'tags='
    let movies = 'movies='

    values.forEach((v) => {
      if (v.trim()) {
        tags += `${v.trim()},`
        movies += `${v.trim()},`
      }
    })

    // Remove trailing comma
    tags = tags.slice(0, -1)
    movies = movies.slice(0, -1)

    queryParams = tags

    console.log(queryParams.toString())
    const response = await fetch(
      `http://localhost:4000/v1/marketplace/products?${queryParams.toString()}`
    )
    if (response.ok) {
      const data = await response.json()
      setFilteredData(data)
    } else {
      console.error('Failed to fetch search results')
    }
  }

  const debouncedFetchResults = debounce(fetchResults, 300)
  /*
    Debounce Function: The debounce function from Lodash is used to limit the rate at which the fetchResults function is called. This improves performance and reduces unnecessary load on your server. The fetchResults function is called only after the user has stopped typing for 300ms.
  */

  useEffect(() => {
    debouncedFetchResults()
    return () => {
      debouncedFetchResults.cancel()
    }
  }, [value])

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: filteredData.length,
    isDropdownVisible: dropdownVisible,
    onEnter: (index) => {
      // console.log('Enter key pressed', filteredData[index])
      handleSelection(filteredData[index])
    },
    onEscape: () => {
      setDropdownVisible(false)
    },
  })

  const handleSearchChange = (e) => {
    setValue(e.target.value)
    setDropdownVisible(true)
  }

  const handleSelection = (record) => {
    setValue(record.title ? record.title : record.name)
    setDropdownVisible(false) // Close the dropdown after selection

    // enforce server-side navigation
    window.location.href = `/marketplace/product/${record.id}`
  }

  const handleContainerBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false)
    }
  }

  useEffect(() => {
    if (focusedIndex !== -1 && resultElementRef.current) {
      const focusedElement = resultElementRef.current.children[focusedIndex]
      focusedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [focusedIndex])

  const handleSubmit = (event) => {
    event.preventDefault()

    router.push({
      pathname: '/marketplace/search',
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
          <InputLabel>Search Products based on Movies, Tags </InputLabel>
          {dropdownVisible && (
            <div
              ref={resultElementRef}
              className="absolute mx-10 z-50 bg-black-100 shadow-lg rounded-md max-h-60 overflow-y-auto"
            >
              {filteredData.length > 0 ? (
                filteredData.map((record, index) => (
                  <div
                    key={index}
                    className="flex w-80 overflow-hidden items-center p-2 border-b cursor-pointer hover:bg-primary-600 hover:bg-opacity-70"
                    onClick={() => handleSelection(record)}
                    style={{
                      backgroundColor:
                        index === focusedIndex ? 'rgba(255,255,255,0.1)' : '',
                    }}
                  >
                    {/* Poster Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={record.thumbnailUrl}
                        alt={record.title ? record.title : record.name}
                        className="h-20 w-14 object-cover"
                      />
                    </div>
                    {/* Title and Release Date */}
                    <div className="flex-grow ml-4">
                      <div className="text-lg font-semibold">
                        {record.title ? record.title : record.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.price}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-80 text-gray-500 p-2">
                  No results were found
                </div>
              )}
            </div>
          )}

          {/* flex w-80 overflow-hidden items-center p-2 border-b cursor-pointer hover:bg-primary-600 hover:bg-opacity-70: These classes are for the overall card. You might want to adjust the width (w-80) or padding (p-2) based on your design.
h-20 w-14 object-cover: These classes are for the movie poster images, ensuring they cover the allotted space nicely. Adjust the height (h-20) and width (w-14) as needed.
text-lg font-semibold and text-sm text-gray-500: These classes are for the title and release date text styling. You can adjust the font size and color as needed. */}

          <SearchIcon className="input-icon text-2xl text-gray-500" />
          {value && (
            <button
              className="input-icon left-auto right-4"
              onClick={() => {
                setValue('')
                // ref.current.focus()
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
