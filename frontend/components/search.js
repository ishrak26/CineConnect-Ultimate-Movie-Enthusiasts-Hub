import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from './input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

import React, { useEffect } from 'react'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/search?query=${value}&limit=${limit}`
    )
    if (response.ok) {
      const data = await response.json()
      setFilteredData(data)
    } else {
      // console.error('Failed to fetch search results')
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
      handleSelection(filteredData[index].name)
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
    // ref.current.focus(); // Focus the search input after selection
    // if (record.type === 'movie') {
    //   router.push(`/movie/${record.id}`)
    // } else if (record.type === 'moviePerson') {
    //   router.push(`/moviePerson/${record.id}`)
    // } else if (record.type === 'user') {
    //   router.push(`/profile/${record.username}`)
    // }

    // enforce server-side navigation
    if (record.type === 'movie') {
      window.location.href = `/movie/${record.id}`
    } else if (record.type === 'moviePerson') {
      window.location.href = `/moviePerson/${record.id}`
    } else if (record.type === 'user') {
      window.location.href = `/profile/${record.username}`
    }
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
          <InputLabel>Search Movies, Movie Persons, Users... </InputLabel>
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
                    onClick={() => handleSelection(record)} // Adjusted to use movie.id for redirection
                    style={{
                      backgroundColor:
                        index === focusedIndex ? 'rgba(255,255,255,0.1)' : '',
                    }}
                  >
                    {/* Poster Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={record.imageUrl}
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
                        {record.release_date
                          ? record.release_date
                          : record.username
                          ? record.username
                          : ''}
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
