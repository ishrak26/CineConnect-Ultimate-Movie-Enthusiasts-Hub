import { useScrollFade } from '@lib/hooks'
import clsx from 'clsx'

export default function ScrollContent({ children, className }) {
  const { ref, scrollClass, onScroll } = useScrollFade()

  return (
    <div
      ref={ref}
      className={clsx(
        'flex flex-nowrap overflow-x-auto scroll-section',
        className,
        scrollClass
      )}
      onScroll={onScroll}
    >
      {children}
    </div>
  )
}
