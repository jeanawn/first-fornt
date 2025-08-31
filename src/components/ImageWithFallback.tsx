import { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  fallback: string; // Emoji ou texte de fallback
  alt: string;
  className?: string;
}

export default function ImageWithFallback({ src, fallback, alt, className = '' }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  const handleError = () => {
    console.log('Image failed to load:', src);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', src);
    setIsLoading(false);
  };

  // Si pas de src ou erreur de chargement, afficher le fallback
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-2xl">{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
      />
    </div>
  );
}