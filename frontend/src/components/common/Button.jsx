import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/animations';
import useMagneticEffect from '../../hooks/useMagneticEffect';

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    light: 'btn-outline-light',
  };

  const classes = `${variants[variant]} ${className}`;
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticEffect(0.2);

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={classes}
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.button>
  );
}
