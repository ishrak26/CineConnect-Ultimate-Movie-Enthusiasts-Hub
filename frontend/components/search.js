import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Input, InputGroup, InputLabel } from './input'
import SearchIcon from '@components/icons/search.svg'
import TimesIcon from '@components/icons/times.svg'
import clsx from 'clsx'

export default function Search({ forwardedRef }) {
  const ref = useRef(null)
  const router = useRouter()
  const [value, setValue] = useState(router.query.query || '')

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
    <form action="submit" onSubmit={handleSubmit}>
      <InputGroup className="mt-8">
        <Input
          className={clsx(value && 'pr-14')}
          placeholder="eg. avengers"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          forwardedRef={forwardedRef || ref}
          hasIcon
          required
        />
        <InputLabel>Search Movies or TV Shows</InputLabel>
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
  )
}
