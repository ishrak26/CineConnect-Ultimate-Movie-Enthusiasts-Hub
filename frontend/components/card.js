import Link from 'next/link'
import Poster from './poster'
import clsx from 'clsx'
import Rating from './rating'

export default function Card({
  id,
  image,
  title,
  type,
  rating,
  className,
  children,
  ...props
}) {
  return (
    <Link
      href={`/${type}/${id}`}
      className={clsx('card', className)}
      {...props}
    >
      <Poster path={image} alt={title} />
      {rating >= 0 && (
        <Rating average={rating} className="absolute top-4 left-4" />
      )}
      {title && <div className="card-title">{title}</div>}
      {children}
    </Link>
  )
}
