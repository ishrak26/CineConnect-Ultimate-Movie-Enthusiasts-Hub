import { useState } from 'react'
import { motion, LayoutGroup } from 'framer-motion'

export default function Segmented({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
  ...props
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const onInputChange = (value, index) => {
    setActiveIndex(index)
    callback(value, index)
  }

  return (
    <div ref={controlRef} {...props}>
      <div className="segments">
        <LayoutGroup>
          {segments.map((item, i) => (
            <motion.div
              key={item.value}
              className="segment relative"
              ref={item.ref}
            >
              {i === activeIndex && (
                <motion.span
                  className="absolute inset-0 bg-grey-600 rounded-md"
                  layoutId={name || 'indicator'}
                  transition={{
                    type: 'spring',
                    duration: 0.3,
                  }}
                />
              )}
              <input
                type="radio"
                value={item.value}
                id={item.value}
                name={name}
                onChange={() => onInputChange(item.value, i)}
                checked={i === activeIndex}
              />
              <label htmlFor={item.value} className="relative ">
                {item.label}
              </label>
            </motion.div>
          ))}
        </LayoutGroup>
      </div>
    </div>
  )
}
