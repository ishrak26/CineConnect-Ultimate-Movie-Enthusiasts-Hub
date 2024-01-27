import clsx from 'clsx'

export default function Poster({ path, alt, size, className, ...props }) {
  const src = path
    ? `https://image.tmdb.org/t/p/${size || 'w500'}${path}`
    : '/placeholder.svg'

  return (
    <div className={clsx('aspect-poster relative', className)} {...props}>
      <img
        src={src}
        alt={alt}
        className="rounded-xl object-cover w-full h-full"
        fill="true"
      />
    </div>
  )
}
