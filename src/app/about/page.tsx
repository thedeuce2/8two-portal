export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 spray-texture pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/logos/8twologo.jpg" 
            alt="8TWO Streetwear" 
            className="w-32 h-32 mx-auto object-contain mb-8"
          />
          <h1 className="text-white font-black text-5xl uppercase tracking-tighter mb-4">
            About 8TWO
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-6">
                Our Story
              </h2>
              <p className="text-gray-400 mb-4">
                8TWO Apparel was born from a simple idea: create premium street wear that doesn't compromise on quality or style. We believe that what you wear is an extension of who you are.
              </p>
              <p className="text-gray-400 mb-4">
                Founded in 2024, we've quickly grown to become a trusted name in the street wear community. Every piece we create is designed with attention to detail, using only the finest materials.
              </p>
              <p className="text-gray-400">
                Our aesthetic is inspired by urban culture, art, and the raw energy of city life. We don't follow trends – we set them.
              </p>
            </div>
            <div className="aspect-square bg-[#111] graffiti-border flex items-center justify-center">
              <img 
                src="/logos/8twologo.jpg" 
                alt="8TWO Streetwear" 
                className="w-40 h-40 object-contain opacity-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">Q</span>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">
                Quality
              </h3>
              <p className="text-gray-400 text-sm">
                Premium materials and expert craftsmanship in every piece
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">
                Style
              </h3>
              <p className="text-gray-400 text-sm">
                Designs that stand out from the crowd
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">
                Community
              </h3>
              <p className="text-gray-400 text-sm">
                Built by and for those who embrace the urban lifestyle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:hello@8two.com"
            className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
