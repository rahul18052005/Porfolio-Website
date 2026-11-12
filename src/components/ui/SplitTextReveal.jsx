import { motion } from 'framer-motion';

export default function SplitTextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.045,
  liquid = false,
  immediate = false,
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 34,
      rotateX: 42,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.78,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      animate={immediate ? 'visible' : undefined}
      whileInView={immediate ? undefined : 'visible'}
      viewport={immediate ? undefined : { once: true, amount: 0.25 }}
      className={`${className} ${liquid ? 'liquid-headline' : ''}`}
      style={{ perspective: '900px' }}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-top mr-[0.26em] last:mr-0"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block origin-bottom will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

