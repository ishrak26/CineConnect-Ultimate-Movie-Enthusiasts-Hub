import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from '@components/input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

import React, { useEffect } from 'react'
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation'

import debounce from 'lodash.debounce'

export default function Search({ forwardedRef, ...props}) {
  const ref = useRef(null)
  const router = useRouter()
  const [value, setValue] = useState(router.query.query || '')

  const [dropdownVisible, setDropdownVisible] = useState(false)

  const resultElementRef = useRef(null)

  const [filteredData, setFilteredData] = useState([])

  const fetchResults = async () => {
    if (!value) return setFilteredData([])
    const limit = 5
    const data = await fetch(
      `http://localhost:4000/v1/movies?title=${value}&limit=${limit}`
    ).then((res) => res.json())
    setFilteredData(data)
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

  const handleSelection = (title, movieId) => {
    setValue(title)
    setDropdownVisible(false) // Close the dropdown after selection
    // ref.current.focus(); // Focus the search input after selection
    // router.push(`/movie/${movieId}`)
    props.onMovieSelect(movieId)
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
          <InputLabel>Search Movies </InputLabel>
          {dropdownVisible && (
            <div
              ref={resultElementRef}
              className="absolute mx-10 z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
            >
              {filteredData.length > 0 ? (
                filteredData.map((movie, index) => (
                  <div
                    key={index}
                    className="flex w-80 overflow-hidden items-center p-2 border-b cursor-pointer hover:bg-primary-600 hover:bg-opacity-70"
                    onClick={() => handleSelection(movie.title, movie.id)} // Adjusted to use movie.id for redirection
                    style={{
                      backgroundColor:
                        index === focusedIndex ? 'rgba(0,0,0,0.1)' : '',
                    }}
                  >
                    {/* Poster Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="h-20 w-14 object-cover"
                      />
                    </div>
                    {/* Title and Release Date */}
                    <div className="flex-grow ml-4">
                      <div className="text-lg font-semibold">{movie.title}</div>
                      <div className="text-sm text-gray-500">
                        {movie.release_date}
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
