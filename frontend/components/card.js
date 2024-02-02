"use client";

import Link from 'next/link'
import Poster from './poster'
import clsx from 'clsx'
import Rating from './rating'

export default function Card({
  id,
  image,
  title,
  type,
  release_date,
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
      {release_date && <div className="card-date">{release_date}</div>}
      {children}
    </Link>
  )
}
