"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WeatherForm } from "@/components/weather-form";

// Simple SVG Logo Component
function Logo() {
  return (
    <div className="flex items-center mb-8 space-x-3 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-white drop-shadow-lg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {/* Sun and cloud icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12.34h-1m15.36 4.24l-.7-.7M6.34 6.34l-.7-.7m14.14 14.14l-.7-.7M6.34 17.66l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
        WeatherApp
      </span>
    </div>
  );
}

export default function Home() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (!id.trim()) {
      setError("Please enter a valid weather ID.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/weather/${id}`);
      if (!res.ok) throw new Error("Weather data not found.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const DetailCard = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <motion.div
      initial={{ opacity: 0.6, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ rotateX: 15, rotateY: 10, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-md cursor-pointer select-none"
    >
      <div className="text-xs uppercase text-white/80">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </motion.div>
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-auto bg-gradient-to-b from-blue-500 to-blue-700 dark:from-gray-900 dark:to-black text-white"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
      >
        <source src="/weather-bg.mp4" type="video/mp4" />
        {/* Fallback text if video not supported */}
        Your browser does not support the video tag.
      </video>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto py-16 px-6 flex flex-col md:flex-row gap-12">
        {/* Left Column: SVG Logo + WeatherForm */}
        <div className="flex-1 flex flex-col items-center bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
          <Logo />

          <h2 className="text-3xl font-semibold mb-6 text-center text-white drop-shadow-md">
            Submit Weather Request
          </h2>

          <WeatherForm />
        </div>

        {/* Right Column: Lookup Weather */}
        <div className="flex-1 flex flex-col items-center bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-white drop-shadow-md">
            Lookup Weather Data
          </h2>

          <input
            type="text"
            placeholder="Enter Weather ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-white/30 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          />

          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-2 mb-4 bg-white/20 hover:bg-white/30 rounded-md transition disabled:opacity-50 w-full"
          >
            {loading ? "Loading..." : "Fetch Weather Data"}
          </button>

          {error && (
            <p className="text-sm text-red-300 text-center mb-4">{error}</p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              <DetailCard label="Date" value={result.date} />
              <DetailCard label="Location" value={result.location} />
              <DetailCard label="Notes" value={result.notes || "None"} />
              <DetailCard
                label="Temperature"
                value={
                  result.weather?.current?.temperature
                    ? `${result.weather.current.temperature}°C`
                    : "N/A"
                }
              />
              <DetailCard
                label="Feels Like"
                value={
                  result.weather?.current?.feelslike
                    ? `${result.weather.current.feelslike}°C`
                    : "N/A"
                }
              />
              <DetailCard
                label="Condition"
                value={
                  result.weather?.current?.weather_descriptions?.[0] ?? "N/A"
                }
              />
              <DetailCard
                label="Humidity"
                value={
                  result.weather?.current?.humidity
                    ? `${result.weather.current.humidity}%`
                    : "N/A"
                }
              />
              <DetailCard
                label="Wind Speed"
                value={
                  result.weather?.current?.wind_speed
                    ? `${result.weather.current.wind_speed} km/h`
                    : "N/A"
                }
              />
              <DetailCard
                label="Precipitation"
                value={
                  result.weather?.current?.precip
                    ? `${result.weather.current.precip} mm`
                    : "N/A"
                }
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


