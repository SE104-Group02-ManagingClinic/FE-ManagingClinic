import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -40 }}
      
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.6, ease: "easeInOut", delay: 0.1 // cubic-bezier mượt
      }}
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
