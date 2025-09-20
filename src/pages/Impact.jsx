import React from "react";

export default function Impact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold">Our Impact</h1>
          <p className="mt-4 text-emerald-100 max-w-3xl">
            We connect artisans to global customers, preserving cultural heritage while
            creating sustainable livelihoods.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow border">
          <p className="text-4xl font-extrabold text-emerald-700">70%</p>
          <p className="mt-1 text-gray-600">of revenue goes directly to artisans</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow border">
          <p className="text-4xl font-extrabold text-emerald-700">25+</p>
          <p className="mt-1 text-gray-600">craft traditions highlighted with stories</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow border">
          <p className="text-4xl font-extrabold text-emerald-700">3x</p>
          <p className="mt-1 text-gray-600">average income increase for active artisans</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl p-8 shadow border">
          <h2 className="text-2xl font-bold text-gray-900">Ethical Sourcing</h2>
          <p className="mt-3 text-gray-700">
            We ensure transparent pricing, fair compensation, and full control of
            product storytelling by artisans.
          </p>
          <ul className="mt-6 list-disc pl-6 text-gray-700 space-y-2">
            <li>Fair-pay policy and fast payouts</li>
            <li>Climate-conscious packaging recommendations</li>
            <li>Community-led cultural verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


