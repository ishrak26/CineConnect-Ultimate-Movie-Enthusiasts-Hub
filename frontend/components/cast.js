import Link from 'next/link'
import ScrollContent from './scroll-content'

export default function Cast({ casts }) {
  return (
    <ScrollContent className="space-x-4 pb-4">
      {casts.casts?.map((person) => (

        <Link
          // key={person.cast_id || person.credit_id}
          key={person.id}
          href={`/cast/${person.id}`}
        >
          <div className="flex items-center">
            <div className="aspect-square relative w-16 shrink-0">
              <img
                src={
                  // person.profile_path
                  //   ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                  //   : '/placeholder.svg'
                  person.image_url
                }
                alt={person.name}
                className="object-cover object-center rounded-full h-16 border-4 border-black-10"
                width={185}
                height={185}
              />
            </div>
            <div className="text-xs ml-4">
              <span className="block truncate">{person.name}</span>
              <span className="text-white-65 truncate">{person.role_name}</span>
            </div>
          </div>
        </Link>
      ))}
    </ScrollContent>
  )
}
