import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';

const ALL_BLOGS = [
  {
    id: 'blog-1',
    title: 'Top Indian Granites Trending in Luxury Architecture',
    category: 'Architecture & Trends',
    date: 'February 2025',
    readTime: '4 min read',
    image: '/images/blog-granite.jpg',
    excerpt: 'From Viscon White to Black Galaxy, discover why Indian granites remain the first choice for architects across Australia, Europe, and the Middle East.',
    content: 'Indian natural granite has earned an unmatched worldwide reputation for structural durability, compressive strength, and extraordinary color diversity. Quarried from the mineral-rich belts of Rajasthan, Andhra Pradesh, and Karnataka, varieties like Viscon White, Tan Brown, and Absolute Black offer architects limitless creative freedom for exterior cladding, high-traffic commercial flooring, and luxury countertops. Their low water absorption rates and resistance to acid weathering make them ideal for coastal villas and busy commercial towers alike.'
  },
  {
    id: 'blog-2',
    title: 'Polish vs. Flamed vs. Honed: Selecting the Right Stone Finish',
    category: 'Technical Guide',
    date: 'January 2025',
    readTime: '5 min read',
    image: '/images/stone-finishes-guide.jpg',
    excerpt: 'Understand how surface treatments impact slip resistance, light reflection, and longevity in commercial vs residential applications.',
    content: 'The finish of a natural stone dictates both its aesthetic presence and functional performance. While high-gloss polished surfaces highlight the crystalline depth of granite, flamed finishes create a thermal textured grip essential for exterior paving and wet areas. Honed surfaces deliver an understated, velvet-smooth matte ambiance preferred in modern minimalist interiors. Specifiers must balance visual expectations with safety standards like the Australian AS/NZS 4586 pendulum slip ratings.'
  },
  {
    id: 'blog-3',
    title: 'The Timeless Legacy of Makrana White Marble',
    category: 'Heritage & Materials',
    date: 'December 2024',
    readTime: '6 min read',
    image: '/images/blog-makrana.jpg',
    excerpt: 'The iconic 99% pure calcite marble of Rajasthan that built the Taj Mahal continues to define contemporary luxury monuments worldwide.',
    content: 'Makrana White Marble is celebrated worldwide for its pure calcium carbonate composition that does not discolor or absorb water over centuries. Processed with advanced diamond gangsaw blades in Rajasthan, Arpran Industries supplies calibrated Makrana slabs to prestigious international estates and luxury hospitality developments. Its luminous translucent translucency and subtle grey veining provide a timeless palatial radiance unattainable by synthetic quartz or ceramics.'
  },
  {
    id: 'blog-4',
    title: 'The Ultra-Thin Stone Revolution: Designing With 2mm Flexible Veneers',
    category: 'Innovation & Cladding',
    date: 'November 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    excerpt: 'How real stone sheets backed by fiberglass and resin allow curved walls, elevator cab weight reductions, and illuminated translucent backsplashes.',
    content: 'Natural stone veneer splits real slate, quartzite, and sandstone into micro-thin layers of 1.5mm to 2.0mm. Reinforced with polymer fiberglass, these flexible sheets weigh just 1.5 kg per square meter yet retain 100% genuine stone texture. Translucent stone veneer variants allow LED backlighting, enabling glowing amber columns, bar counters, and dynamic reception feature walls that install in a fraction of traditional slab time.'
  },
  {
    id: 'blog-5',
    title: 'Specifying Sandstone Paving for Extreme Climate Resilience',
    category: 'Landscaping & Urban Design',
    date: 'October 2024',
    readTime: '4 min read',
    image: '/images/hero/slide-4.jpg',
    excerpt: 'Best practices for specifying Jodhpur and Kandla sandstone for freeze-thaw durability, pool salt resistance, and civic streetscapes.',
    content: 'Indian quartzitic sandstone quarried from Rajasthan combines warm earthy tones with exceptional compressive strength. When calibrated to uniform 22mm or 30mm thickness and sawn on all six sides, it provides an architecturally clean paving module for private courtyard gardens and expansive public plazas. Its natural thermal insulation keeps outdoor surfaces comfortable under bare feet even beneath the scorching summer sun.'
  }
];

export default function BlogPage({ onOpenBlog }) {
  const { blogs: cmsBlogs, pages } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const blogPageData = pages?.blogs || pages?.blog;
  const headerTitle = blogPageData?.h1 || "Architectural Stone Journal & Material Guides";
  const headerSubtitle = blogPageData?.tagline || "Insights on natural stone geology, diamond gangsaw fabrication, slip-resistance standards, and innovative surface treatments from our technical team.";

  // Normalize CMS blogs
  const sourceBlogs = (cmsBlogs && cmsBlogs.length > 0)
    ? cmsBlogs.map(b => ({
        id: b.id || b.slug,
        title: b.title,
        category: b.category || 'Architecture & Trends',
        date: b.date || 'Recent',
        readTime: b.read_time || b.readTime || '5 min read',
        image: b.image || '/images/blog-granite.jpg',
        alt_text: b.alt_text || b.title || '',
        excerpt: b.excerpt || '',
        content: b.content || '',
        sections: Array.isArray(b.sections) ? b.sections : [],
        key_points: Array.isArray(b.key_points) ? b.key_points : [],
        faqs: Array.isArray(b.faqs) ? b.faqs : []
      }))
    : ALL_BLOGS;

  const categories = ['All', ...Array.from(new Set(sourceBlogs.map(b => b.category).filter(Boolean)))];

  const filtered = selectedCategory === 'All' 
    ? sourceBlogs 
    : sourceBlogs.filter(b => b.category === selectedCategory);

  return (
    <div>
      <SEO 
        title={blogPageData?.title || "Architectural Stone Journal & Material Insights"}
        description="Explore technical stone articles, architectural trend forecasts, and surface finishing guides by ARPRAN Industries. Written for architects, contractors, and luxury homebuilders."
        keywords="natural stone blog, Indian granite guides, marble selection tips, flexible stone veneer tutorial, stone paving specification"
        canonicalPath="/blog"
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#070E1C] via-[#0B1528] to-[#0E1A32] text-white py-10 sm:py-14 border-b border-slate-800 relative overflow-hidden">
        {/* Ambient Subtle Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-amber-400/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -top-24 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{blogPageData?.content?.badge || "Architectural Insights & Journal"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.2]">
            {headerTitle}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* Main Blog Archive */}
      <section className="py-10 sm:py-12 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-[#0B1528] text-amber-400 border-amber-400/60 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-52 w-full aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/92 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs backdrop-blur-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {article.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#0A4E9B] transition line-clamp-2 leading-snug">
                      {article.title}
                    </h2>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenBlog && onOpenBlog(article)}
                    className="text-xs font-bold text-[#0A4E9B] hover:text-[#073b77] flex items-center gap-1"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <span className="text-[10px] font-medium text-slate-400">Technical Spec</span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
