
      {/* 1. CMS-DRIVEN HERO SECTION */}
      <section className="relative min-h-[520px] lg:min-h-[600px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.tag || currentSlide.title || "ARPRAN Natural Stone"}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
          <div className="max-w-3xl text-white">
            {currentSlide.tag && (
              <p className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-amber-300 mb-4">
                {currentSlide.tag}
              </p>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              {currentSlide.title || settings?.site_name || COMPANY_INFO.name}
            </h1>

            {currentSlide.subtitle && (
              <p className="mt-5 text-xl sm:text-2xl text-white/90">
                {currentSlide.subtitle}
              </p>
            )}

            {currentSlide.highlight && (
              <p className="mt-4 text-sm sm:text-base font-semibold text-amber-200">
                {currentSlide.highlight}
              </p>
            )}

            {heroDescription && (
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-white/85">
                {heroDescription}
              </p>
            )}

            <Link
              to={currentSlide.button_link || "/products"}
              className="inline-flex items-center gap-3 mt-8 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
            >
              {currentSlide.button_text || "Explore Collections"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentHeroSlide(
                  (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
                )
              }
              aria-label="Previous slide"
              className="absolute z-20 left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentHeroSlide((prev) => (prev + 1) % activeSlides.length)
              }
              aria-label="Next slide"
              className="absolute z-20 right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </section>
