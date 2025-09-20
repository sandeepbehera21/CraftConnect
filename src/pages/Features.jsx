import React, { useState, useEffect } from "react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: 0,
      title: "AI Product Story Generator",
      description: "Transform your craft into compelling stories with our advanced AI. Upload a photo and watch as our AI creates beautiful descriptions, cultural stories, and social media captions that connect with customers.",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
      benefits: ["Instant content generation", "Cultural storytelling", "Social media ready", "Multiple formats"],
      demo: "Upload any handcrafted item and get professional marketing content in seconds"
    },
    {
      id: 1,
      title: "Smart Artisan Dashboard",
      description: "Manage your entire craft business from one powerful dashboard. Track products, orders, revenue, and customer interactions with real-time analytics and insights.",
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
      benefits: ["Product management", "Order tracking", "Revenue analytics", "Customer insights"],
      demo: "See all your products, orders, and earnings in one beautiful interface"
    },
    {
      id: 2,
      title: "Global Marketplace Access",
      description: "Reach customers worldwide through our curated marketplace. Your handcrafted items get premium visibility with professional presentation and secure payment processing.",
      icon: "🌍",
      color: "from-green-500 to-emerald-500",
      benefits: ["Global reach", "Premium visibility", "Secure payments", "Customer reviews"],
      demo: "Your crafts showcased to customers across the globe with professional presentation"
    },
    {
      id: 3,
      title: "AI Chatbot Assistant",
      description: "24/7 customer support powered by AI. Our intelligent chatbot helps customers find products, answers questions, and provides personalized recommendations.",
      icon: "💬",
      color: "from-orange-500 to-red-500",
      benefits: ["24/7 support", "Instant responses", "Product recommendations", "Order assistance"],
      demo: "Customers get instant help finding the perfect handcrafted item"
    },
    {
      id: 4,
      title: "Cultural Heritage Preservation",
      description: "Celebrate and preserve traditional crafting techniques. Our platform highlights the cultural significance and heritage behind each handcrafted piece.",
      icon: "🏛️",
      color: "from-indigo-500 to-purple-500",
      benefits: ["Heritage documentation", "Cultural stories", "Technique preservation", "Artisan recognition"],
      demo: "Every craft tells a story of tradition, culture, and skilled craftsmanship"
    },
    {
      id: 5,
      title: "Mobile-First Experience",
      description: "Access your business anywhere, anytime. Our responsive design ensures seamless experience across all devices, from mobile phones to desktop computers.",
      icon: "📱",
      color: "from-teal-500 to-blue-500",
      benefits: ["Mobile optimized", "Cross-platform", "Offline capabilities", "Push notifications"],
      demo: "Manage your craft business on the go with our mobile-optimized interface"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Artisans" },
    { number: "50K+", label: "Products Sold" },
    { number: "100+", label: "Countries" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Modern Artisans
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover how CraftConnect revolutionizes the way artisans showcase, sell, and manage their handcrafted products with cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </a>
              <a href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools empowers artisans to build, grow, and scale their craft businesses.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center mb-12">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 m-2 rounded-full font-medium transition-all duration-300 ${
                  activeFeature === index
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <span className="mr-2">{feature.icon}</span>
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-8 lg:p-12">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} text-white text-2xl mb-6`}>
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {features[activeFeature].description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {features[activeFeature].benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 italic">
                      💡 <strong>Demo:</strong> {features[activeFeature].demo}
                    </p>
                  </div>
                </div>

                <div className={`bg-gradient-to-br ${features[activeFeature].color} p-8 lg:p-12 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">{features[activeFeature].icon}</div>
                    <h4 className="text-2xl font-bold mb-4">See It In Action</h4>
                    <p className="text-lg opacity-90 mb-6">
                      Experience the power of {features[activeFeature].title.toLowerCase()}
                    </p>
                    <a 
                      href="/signup" 
                      className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                    >
                      Try Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Craft Business?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of artisans who are already growing their businesses with CraftConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Get Started Free
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300">
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
