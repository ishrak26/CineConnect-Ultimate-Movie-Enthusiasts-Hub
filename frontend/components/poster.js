import clsx from 'clsx'
import LazyImage from './LazyImage'


export default function Poster({ path, alt, size, className, ...props }) {

  const src = path 
  // ? `https://image.tmdb.org/t/p/${size || 'w500'}${path}`
  // : '/placeholder.svg'

  return (
    <div className={clsx('aspect-poster relative', className)} {...props}>
 
      {/* <img
        src={src}
        alt={alt || 'Image'}
        loading="lazy"
        className={`rounded-xl object-cover w-full h-full`}
      /> */}

      <LazyImage src={src} alt={alt || 'Image'} className={`rounded-xl object-cover w-full h-full`} />

    </div>

  )
}

