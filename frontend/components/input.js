import clsx from 'clsx'

export function InputGroup({ children, className, ...props }) {
  return (
    <div className={clsx('input-group', className)} {...props}>
      {children}
    </div>
  )
}

export function Input({ hasIcon, className, forwardedRef, ...props }) {
  return (
    <input
      type="text"
      className={clsx('input', hasIcon && 'has-icon', className)}
      ref={forwardedRef}
      {...props}
    />
  )
}

export function InputLabel({ children, className, ...props }) {
  return (
    <label className={clsx('input-label', className)} {...props}>
      {children}
    </label>
  )
}
