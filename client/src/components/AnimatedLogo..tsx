import { motion } from "framer-motion"
import logo from "../assets/second-brain-logo.png"

interface Props {
  size?: number
  showText?: boolean
}

export default function AnimatedLogo({
  size = 32,
  showText = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3"
    >
      <motion.img
        src={logo}
        alt="Second Brain"
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      {showText && (
        <span className="text-lg font-semibold text-white">
          Second Brain
        </span>
      )}
    </motion.div>
  )
}