import { motion } from 'framer-motion'

/**
 * Fade-up scroll reveal for sections and cards.
 * Wrap any block: <Reveal>…</Reveal>. Use `delay` (seconds) to stagger siblings.
 * Respects prefers-reduced-motion via the MotionConfig in AppRoutes.
 */
export default function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
