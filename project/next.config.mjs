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
        hostname: "batdongsan.com.vn"
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "file4.batdongsan.com.vn"
      },
      {
        hostname: "upload.wikimedia.org"
      }
    ],
  },
};

export default nextConfig;
