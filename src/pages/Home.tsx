import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CakeSlice, Heart, Sparkles } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[var(--color-zora-blush)]">
        <div className="absolute inset-0 z-0 flex md:flex-row flex-col">
          <div className="w-full md:w-1/2 h-full bg-[var(--color-zora-oat)] flex items-center justify-center p-12">
            <div className="max-w-xl text-center md:text-left relative z-10">
              <span className="mb-6 inline-block text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-zora-stone)]">
                Baked Fresh Daily
              </span>
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-[var(--color-zora-ink)] md:text-7xl lg:text-8xl">
                Classic Bakery <br /> Joy.
              </h1>
              <p className="mb-10 text-lg font-medium text-[var(--color-zora-stone)] md:text-xl">
                Indulge in our world-famous cupcakes, classic cakes, and wholesome millet treats. Made from scratch, just like home.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/shop">
                  <Button size="lg" className="w-full sm:w-auto">
                    Order Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full relative">
            <img 
              src="https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1974&auto=format&fit=crop" 
              alt="Delicious frosted cupcakes" 
              className="h-full w-full object-cover"
          loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-24 bg-[var(--color-zora-alabaster)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-[var(--color-zora-ink)] shadow-sm">
                <CakeSlice className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-3xl font-bold text-[var(--color-zora-ink)]">Baked from Scratch</h3>
              <p className="text-[var(--color-zora-stone)] font-medium leading-relaxed">
                Every morning, our bakers crack eggs, sift flour, and whip buttercream to bring you the freshest treats possible.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-zora-clay)] text-[var(--color-zora-ink)] shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-3xl font-bold text-[var(--color-zora-ink)]">Wholesome Millets</h3>
              <p className="text-[var(--color-zora-stone)] font-medium leading-relaxed">
                We blend classic recipes with nutrient-rich ancient grains like Ragi and Jowar for a guilt-free, delicious twist.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-zora-oat)] border-2 border-[var(--color-zora-ink)]/10 text-[var(--color-zora-ink)] shadow-sm">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-serif text-3xl font-bold text-[var(--color-zora-ink)]">Made with Love</h3>
              <p className="text-[var(--color-zora-stone)] font-medium leading-relaxed">
                From our signature pastel swirls to our hand-piped messages, every detail is crafted to bring joy to your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[var(--color-zora-oat)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-16 flex flex-col items-center text-center gap-6">
            <h2 className="mb-4 font-serif text-5xl font-bold text-[var(--color-zora-ink)]">Bakery Favorites</h2>
            <p className="text-[var(--color-zora-stone)] font-medium max-w-2xl">Our most beloved treats, from signature pastel cupcakes to our famous millet-infused classic cookies.</p>
            <Link to="/shop" className="group mt-4 flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)] transition-colors hover:text-[var(--color-zora-stone)]">
              Shop All Treats <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Signature Vanilla Cupcake", price: "$4.50", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop" },
              { name: "Chocolate Ragi Cake Slice", price: "$7.00", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop" },
              { name: "Classic Chocolate Chunk Cookie", price: "$3.50", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop" },
              { name: "Strawberry Buttercream Cake", price: "$45.00", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop" }
            ].map((product, i) => (
              <Link to="/product/1" key={i} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[var(--color-zora-ink)]/5">
                <div className="relative aspect-square overflow-hidden bg-[var(--color-zora-alabaster)]">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 w-full translate-y-full bg-[var(--color-zora-clay)]/90 backdrop-blur-sm py-4 text-center text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] transition-transform duration-300 group-hover:translate-y-0">
                    Quick Add
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="mb-2 font-serif text-xl font-bold text-[var(--color-zora-ink)]">{product.name}</h3>
                  <p className="text-sm font-bold text-[var(--color-zora-stone)]">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 bg-[var(--color-zora-clay)] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2070&auto=format&fit=crop" 
            alt="Background texture" 
            className="h-full w-full object-cover mix-blend-overlay"
        loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center md:px-12 bg-white/80 backdrop-blur-md max-w-4xl py-16 rounded-3xl shadow-sm border border-white">
          <h2 className="mb-6 font-serif text-4xl font-bold text-[var(--color-zora-ink)] md:text-5xl lg:text-6xl">Celebrate with Zora</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-[var(--color-zora-stone)]">
            From birthdays to weddings, our custom cakes and dessert tables bring a touch of classic bakery magic to your special moments.
          </p>
          <Button size="lg" className="bg-[var(--color-zora-ink)] text-[var(--color-zora-oat)] hover:bg-[var(--color-zora-ink)]/90">
            View Catering Menu
          </Button>
        </div>
      </section>
    </div>
  );
}
