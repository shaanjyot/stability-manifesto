/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid broken webpack vendor chunks like `./vendor-chunks/@supabase.js` (MODULE_NOT_FOUND on @)
    serverComponentsExternalPackages: [
      'pdf-parse',
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
  },
}

module.exports = nextConfig