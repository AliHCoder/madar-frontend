import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // برای داده‌های Mock (picsum.photos)
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      // وقتی بک‌اند واقعی آماده شد اینا رو اضافه کن:
      // {
      //   protocol: 'https',
      //   hostname: 'your-cdn.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3001',
      //   pathname: '/uploads/**',
      // },
    ],
  },
};

export default nextConfig;
