import clsx from 'clsx'
import Star from '@components/icons/star.svg'

export default function Rating({
  average,
  count,
  inMoviePage = false,
  className,
  ...props
}) {
  return (
    <div
      className={clsx(
        'inline-flex items-center py-1 px-2 bg-black-65 backdrop-blur-md rounded-lg text-[#FFAD49]',
        className
      )}
      {...props}
    >
      {/* <span className="ml-2">{average.toFixed(1)}</span> */}

      <Star />
      {inMoviePage && (
        <div>
          <span className="ml-2">{average}/10</span>
          <span className="ml-2">
            ({count} vote{count > 1 && 's'})
          </span>
        </div>
      )}
      {!inMoviePage && (
        <div>
          <span className="ml-2">{average}</span>
        </div>
      )}
    </div>
  )
}
