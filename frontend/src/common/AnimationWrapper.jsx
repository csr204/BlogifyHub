import React from "react";
import { motion, AnimatePresence } from "framer-motion";
//framer motion lib for creating animations in react
const AnimationWrapper = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.5 },
  keyValue,
  className,
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      key={keyValue}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
