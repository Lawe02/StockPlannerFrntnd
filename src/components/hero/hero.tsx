import AuthButton from "../auth";

export default function Hero() {
  return (
    <div
      className="bg-cover bg-center min-h-[80vh]" // Adjusted height
      style={{
        backgroundImage:
          "url('src/assets/austin-distel-goFBjlQiZFU-unsplash.jpg')",
      }}
    >
      {/* Centered and transparent overlay */}
      <div className="flex justify-center items-center h-full">
        <div className="bg-black bg-opacity-50 text-white py-16 px-6 max-w-3xl rounded-lg">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Smarter Investment Planning
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            Track your investments and grow your portfolio with ease.
          </p>
          <div className="mt-6 flex justify-center">
            <AuthButton
              href="/signup"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white font-semibold"
            >
              Get Started
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  );
}
