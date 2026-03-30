import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-2 border-primary-500 border-t-transparent rounded-full`}
    />
  )
}

export default LoadingSpinner
