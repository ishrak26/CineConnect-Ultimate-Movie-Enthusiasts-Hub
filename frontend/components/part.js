import { format } from 'date-fns'
import Link from 'next/link'
import Card from './card'
import ArrowIcon from './icons/arrow.svg'

export default function Part({ id, poster, rating, date, title, overview }) {
  return (
    <div
      key={id}
      className="flex flex-col md:flex-row bg-black-30 p-8 gap-8 rounded-xl"
    >
      <div className="w-full md:w-1/3  lg:w-1/5 flex-shrink-0">
        <Card
          id={id}
          image={poster}
          type="movie"
          rating={rating}
          className="pb-2"
        />
      </div>
      <div className="w-full">
        {date && (
          <span className="block">{format(new Date(date), 'yyyy')}</span>
        )}
        {title && <strong className="heading block">{title}</strong>}
        {overview && <p className="text-white-65 mt-2">{overview}</p>}
        <Link
          href={`/movie/${id}`}
          className="button button-primary button-sm mt-4"
        >
          Details
          <ArrowIcon className="text-xl ml-4" />
        </Link>
      </div>
    </div>
  )
}
