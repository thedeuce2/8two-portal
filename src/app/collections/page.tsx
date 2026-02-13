import Link from 'next/link';

const collections = [
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Essential urban pieces for everyday wear',
    image: '/collections/streetwear.jpg',
  },
  {
    id: 'athletic',
    name: 'Athletic',
    description: 'Performance gear for active lifestyles',
    image: '/collections/athletic.jpg',
  },
  {
    id: 'limited',
    name: 'Limited Edition',
    description: 'Exclusive drops and special collaborations',
    image: '/collections/limited.jpg',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with our gear',
    image: '/collections/accessories.jpg',
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="bg-[#111] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white font-black text-4xl uppercase tracking-tighter mb-2">
            Collections
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            Curated drops and exclusive styles
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/shop?collection=${collection.id}`}
              className="group relative aspect-[4/3] bg-[#111] overflow-hidden graffiti-border"
            >
              {/* Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-3xl">
                      {collection.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2">
                  {collection.name}
                </h2>
                <p className="text-gray-400 uppercase tracking-widest text-sm">
                  {collection.description}
                </p>
                <span className="mt-6 text-white font-bold uppercase tracking-wider text-sm border-b-2 border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
