import clsx from 'clsx'
import ArrowIcon from './icons/arrow.svg'
import { useRouter } from 'next/router'

export default function Pagination({
  currentPage,
  totalPages,
  className,
  ...props
}) {
  const router = useRouter()
  const total = totalPages >= 500 ? 500 : Number(totalPages)
  const current = currentPage ? Number(currentPage) : 1

  return (
    <div
      className={clsx('flex justify-center items-center space-x-4', className)}
      {...props}
    >
      <button
        className="button button-primary justify-around flex-1 md:flex-grow-0"
        aria-disabled="true"
        disabled={current === 1}
        onClick={() =>
          router.push({
            query: {
              ...router.query,
              page: current - 1,
            },
          })
        }
      >
        <ArrowIcon className="rotate-180 md:mr-4" />
        Previous
      </button>

      <span className="flex-shrink-0">
        {current} / {total}
      </span>

      <button
        className="button button-primary justify-around flex-1 md:flex-grow-0"
        aria-disabled="true"
        disabled={current >= total}
        onClick={() =>
          router.push({
            query: {
              ...router.query,
              page: current + 1,
            },
          })
        }
      >
        Next
        <ArrowIcon className="md:ml-4" />
      </button>
    </div>
  )
}
