import groupBy from 'lodash.groupby'
import Link from 'next/link'

export default function Credits({ crew }) {
  const jobs = ['Director', 'Characters', 'Screenplay', 'Writer', 'Story']

  const persons = groupBy(
    crew.filter((person) => jobs.includes(person.job)),
    'name'
  )

  const credits = Object.keys(persons).map((name) => ({
    name,
    id: persons[name][0].id,
    jobs: [
      ...persons[name]
        .map((person) => person.job)
        .filter((person) => person.job === 'Director'),
      ...persons[name]
        .map((person) => person.job)
        .filter((person) => person.job !== 'Director'),
    ],
  }))

  return (
    <div className="grid grid-cols-2 gap-4 justify-between">
      {[
        ...credits.filter((c) => c.jobs.includes('Director')),
        ...credits.filter((c) => !c.jobs.includes('Director')),
      ].map((person) => (
        <Link href={`/person/${person.id}`} key={person.id}>
          <strong className="font-semibold">{person.name}</strong>
          <p className="text-white-65">{person.jobs.join(', ')}</p>
        </Link>
      ))}
    </div>
  )
}
