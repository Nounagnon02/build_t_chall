import { useState } from 'react';

export default function Image({ src, alt, className = '', width, height, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!loaded && !error && (
        <div className="absolute inset-0 skeleton" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-perle text-charbon/30 text-sm">
          Image non disponible
        </div>
      ) : (
        <img
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
}
