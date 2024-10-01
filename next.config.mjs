/**  @type {import('next').NextConfig} */
const nextConfig = {}; 

export default nextConfig; 



/* @type {import('next').NextConfig} 
const nextConfig = {
    reactStrictMode: false, // Desactivar en desarrollo para mejorar velocidad
    swcMinify: true, // Habilitar minificación con SWC
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // Desactivar la optimización de splitChunks en desarrollo
        config.optimization.splitChunks = {
          cacheGroups: {
            default: false,
          },
        };
      }
      return config;
    },
  };
  
  export default nextConfig;*/
  