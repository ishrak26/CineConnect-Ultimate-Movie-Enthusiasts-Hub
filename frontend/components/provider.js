export default function Provider({ logo, name, link }) {
  const img = logo
    ? `https://image.tmdb.org/t/p/w154/${logo}`
    : '/placeholder.svg'

  return (
    <a
      href={link || '#'}
      target={link ? '_blank' : ''}
      rel="noreferrer"
      className="flex items-center bg-black-30 pr-4 rounded-xl"
    >
      <img
        className="w-12 rounded-xl flex-shrink-0"
        src={img}
        alt={name || 'No provider'}
      />
      <span className="ml-2">{name || 'No Provider'}</span>
    </a>
  )
}
