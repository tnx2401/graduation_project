/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "tpc.googlesyndication.com",
      },
      {
        hostname: "placehold.co",
      },
      {
        hostname: "i.pinimg.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "staticfile.batdongsan.com.vn",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
