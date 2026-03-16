export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-[var(--color-zora-clay)]">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2000&auto=format&fit=crop" 
            alt="Baking process" 
            className="h-full w-full object-cover mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-6 text-center md:px-12">
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-[var(--color-zora-ink)] md:text-7xl lg:text-8xl">
            Our Story.
          </h1>
          <p className="max-w-2xl text-lg font-medium text-[var(--color-zora-ink)]/80 md:text-xl">
            Bringing classic bakery joy to your neighborhood, one batch at a time.
          </p>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-16 md:py-24 bg-[var(--color-zora-alabaster)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <span className="mb-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">How We Started</span>
              <h2 className="mb-8 font-serif text-4xl font-bold text-[var(--color-zora-ink)] md:text-5xl">A Love for Baking</h2>
              <div className="space-y-6 text-base font-medium leading-relaxed text-[var(--color-zora-stone)] md:text-lg">
                <p>
                  Zora Bakes began with a simple desire: to recreate the nostalgic, comforting taste of classic American bakeries, but with a wholesome, modern twist. 
                </p>
                <p>
                  We believe that a cupcake isn't just a dessert; it's a celebration. That's why we crack every egg, sift every cup of flour, and frost every cake by hand. We've also introduced ancient millets into our classic recipes, adding a tender crumb and a boost of nutrition without ever compromising on that classic bakery taste.
                </p>
                <p>
                  From our signature pastel swirls to our warm, welcoming storefronts, everything we do is designed to make your day a little bit sweeter.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 aspect-square w-full overflow-hidden rounded-3xl bg-[var(--color-zora-oat)] shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=1000&auto=format&fit=crop" 
                alt="Artisan Baking" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Ingredients */}
      <section className="py-16 md:py-24 bg-[var(--color-zora-blush)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-serif text-4xl font-bold text-[var(--color-zora-ink)] md:text-5xl">Baked Fresh Daily</h2>
            <p className="mx-auto max-w-2xl text-base font-medium text-[var(--color-zora-ink)]/80 md:text-lg">
              We don't take shortcuts. Our treats are made from scratch using the finest ingredients we can find.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                title: "Real Butter & Vanilla",
                desc: "We use only sweet cream butter and pure vanilla extract. No artificial flavors or shortening, ever. You can taste the difference in every bite."
              },
              {
                title: "Wholesome Millets",
                desc: "We blend traditional flours with nutrient-rich ancient grains like Ragi and Jowar, creating a unique, tender texture that's both delicious and slightly better for you."
              },
              {
                title: "Hand-Piped Joy",
                desc: "Every swirl of buttercream is piped by hand by our skilled decorators. We believe the care put into making a treat is just as important as the ingredients."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
                <h3 className="mb-4 font-serif text-2xl font-bold text-[var(--color-zora-ink)] md:text-3xl">{item.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-[var(--color-zora-stone)] md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
