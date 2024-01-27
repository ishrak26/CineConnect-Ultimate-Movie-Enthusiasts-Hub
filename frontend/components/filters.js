import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { Input, InputGroup, InputLabel } from './input'
import ReactSlider from 'react-slider'
import FilterIcon from './icons/filter.svg'
import clsx from 'clsx'

const FiltersContext = createContext()

export default function Filters({ genres }) {
  const router = useRouter()

  const [show, setShow] = useState(false)

  const [sort, setSort] = useState(router.query.sort_by || 'popularity.desc')

  const [yearMin, setYearMin] = useState(
    router.query['primary_release_date.gte']
      ? router.query['primary_release_date.gte'].split('-')[0]
      : 1900
  )
  const [yearMax, setYearMax] = useState(
    router.query['primary_release_date.gte']
      ? router.query['primary_release_date.lte'].split('-')[0]
      : new Date().getFullYear()
  )
  const [selectedGenres, setSelectedGenres] = useState(
    router.query.with_genres ? router.query.with_genres.split(',') : []
  )
  const [rate, setRate] = useState(
    router.query['vote_average.gte']
      ? Number(router.query['vote_average.gte'])
      : 0
  )

  const [votes, setVotes] = useState(
    router.query['vote_count.gte']
      ? Number(router.query['vote_count.gte'])
      : 100
  )

  useEffect(() => {
    setSort(router.query.sort_by || 'popularity.desc')

    setYearMin(
      router.query['primary_release_date.gte']
        ? router.query['primary_release_date.gte'].split('-')[0]
        : 1900
    )

    setYearMax(
      router.query['primary_release_date.gte']
        ? router.query['primary_release_date.lte'].split('-')[0]
        : new Date().getFullYear()
    )

    setSelectedGenres(
      router.query.with_genres ? router.query.with_genres.split(',') : []
    )

    setRate(
      router.query['vote_average.gte']
        ? Number(router.query['vote_average.gte'])
        : 0
    )

    setVotes(
      router.query['vote_count.gte']
        ? Number(router.query['vote_count.gte'])
        : 100
    )
  }, [router.query])

  const handleSubmit = () => {
    router.push({
      query: {
        page: 1,
        type: router.query.type,
        sort_by: sort,
        with_genres: selectedGenres.join(','),
        'primary_release_date.gte': yearMin ? `${yearMin}-01-01` : null,
        'primary_release_date.lte': yearMax ? `${yearMax}-01-01` : null,
        'first_air_date.gte': yearMin ? `${yearMin}-01-01` : null,
        'first_air_date.lte': yearMax ? `${yearMax}-01-01` : null,
        'vote_average.gte': rate,
        'vote_count.gte': votes,
      },
    })
  }

  return (
    <div>
      <FiltersContext.Provider
        value={{
          sort,
          setSort,
          yearMin,
          setYearMin,
          yearMax,
          setYearMax,
          selectedGenres,
          setSelectedGenres,
          rate,
          setRate,
          votes,
          setVotes,
        }}
      >
        <button
          className={clsx(
            show ? 'button-primary' : 'button-trans',
            'lg:hidden button'
          )}
          onClick={() => setShow(!show)}
        >
          <FilterIcon className="mr-2" />
          <span>Filters</span>
        </button>
        <div
          className={clsx(
            !show && 'hidden',
            'origin-top pt-4 lg:block lg:pt-0'
          )}
        >
          <div className="space-y-4 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2 lg:masked-overflow-y scroll-section">
            <strong className="block heading">Filters</strong>
            <Sort />
            <ReleaseDate type={router.query.type} />
            <Genres genres={genres} />
            <Rating />
            <Votes />
          </div>
          <div className="sticky -bottom-20">
            <button
              className="button button-primary w-full mt-4 text-center justify-center"
              onClick={handleSubmit}
            >
              Filter Results
            </button>
          </div>
        </div>
      </FiltersContext.Provider>
    </div>
  )
}

function Sort() {
  const { sort, setSort } = useContext(FiltersContext)

  return (
    <InputGroup>
      <select
        className="input appearance-none"
        name="sort_by"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="popularity.desc">Popularity Descending</option>
        <option value="popularity.asc">Popularity Ascending</option>
        <option value="vote_average.desc">Rating Descending</option>
        <option value="vote_average.asc">Rating Ascending</option>
        <option value="primary_release_date.desc">
          Release Date Descending
        </option>
        <option value="primary_release_date.asc">Release Date Ascending</option>
        <option value="title.asc">Title (A-Z)</option>
        <option value="title.desc">Title (Z-A)</option>
      </select>
      <InputLabel>Sort</InputLabel>
    </InputGroup>
  )
}

function ReleaseDate({ type }) {
  const { yearMin, setYearMin, yearMax, setYearMax } =
    useContext(FiltersContext)

  return (
    <div>
      <strong className="block font-semibold mb-4">
        {type === 'tv' ? 'First Air Year' : 'Release Year'}
      </strong>
      <div className="space-y-2">
        <InputGroup>
          <Input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
          />
          <InputLabel className="-translate-y-6">From</InputLabel>
        </InputGroup>
        <InputGroup>
          <Input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
          />
          <InputLabel className="-translate-y-6">to</InputLabel>
        </InputGroup>
      </div>
    </div>
  )
}

function Genres({ genres }) {
  const { selectedGenres, setSelectedGenres } = useContext(FiltersContext)

  return (
    <div>
      <strong className="block font-semibold mb-2">Genres</strong>
      <div className="flex flex-wrap gap-2 p-4 bg-black-10 rounded-xl">
        {genres.map((genre) => {
          const isActive = selectedGenres.find((id) => id == genre.id)
          return (
            <button
              key={genre.id}
              className={clsx(
                'p-2 rounded-full text-sm transition',
                isActive ? 'bg-primary-400' : 'bg-black-10'
              )}
              onClick={() =>
                setSelectedGenres(
                  isActive
                    ? selectedGenres.filter((id) => id != genre.id)
                    : [...selectedGenres, genre.id]
                )
              }
            >
              {genre.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Rating() {
  const { rate, setRate } = useContext(FiltersContext)
  return (
    <div>
      <strong className="block font-semibold mb-2">Minimum rate</strong>
      <div className="bg-black-10 p-4 pb-6 rounded-lg">
        <ReactSlider
          className="slider"
          min={0}
          max={10}
          minDistance={1}
          value={rate}
          onChange={setRate}
          renderThumb={(props, state) => (
            <span className="thumb" {...props}>
              {state.valueNow}
            </span>
          )}
        />
      </div>
    </div>
  )
}

function Votes() {
  const { votes, setVotes } = useContext(FiltersContext)
  return (
    <div>
      <InputGroup>
        <Input
          type="number"
          min="0"
          value={votes}
          onChange={(e) => setVotes(e.target.value)}
        />
        <InputLabel>Min. Vote Count</InputLabel>
      </InputGroup>
    </div>
  )
}
