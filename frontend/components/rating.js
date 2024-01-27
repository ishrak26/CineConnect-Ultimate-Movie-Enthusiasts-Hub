import clsx from 'clsx'
import Star from '@components/icons/star.svg'

export default function Rating({ average, className, ...props }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center py-1 px-2 bg-black-65 backdrop-blur-md rounded-lg text-[#FFAD49]',
        className
      )}
      {...props}
    >
      <Star />
      <span className="ml-2">{average.toFixed(1)}</span>
    </div>
  )
}
