import AuthButton from "../authBtn/auth";

export default function Hero() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center" // Ensures full viewport height and proper centering
      style={{
        backgroundImage:
          "url('src/assets/austin-distel-goFBjlQiZFU-unsplash.jpg')",
      }}
    >
      {/* Centered and transparent overlay */}
      <div className="bg-black bg-opacity-50 text-white py-16 px-6 max-w-3xl rounded-lg text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Smarter Investment Planning
        </h1>
        <p className="mt-4 text-lg sm:text-xl">
          Track your investments and grow your portfolio with ease.
        </p>
        <div className="mt-6">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
