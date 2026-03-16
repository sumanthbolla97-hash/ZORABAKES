import { Button } from "@/components/ui/Button";

export function Contact() {
  return (
    <div className="container mx-auto px-6 py-12 md:px-12 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 font-serif text-5xl font-bold text-[var(--color-zora-ink)] md:text-6xl">Say Hello</h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--color-zora-stone)]">
          Have a question about an order, want to discuss a custom cake, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Contact Form */}
        <div className="flex flex-col gap-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
          <h2 className="font-serif text-4xl font-bold text-[var(--color-zora-ink)]">Send a Message</h2>
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  className="border-2 border-[var(--color-zora-ink)]/10 rounded-xl bg-[var(--color-zora-alabaster)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-zora-ink)]/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  className="border-2 border-[var(--color-zora-ink)]/10 rounded-xl bg-[var(--color-zora-alabaster)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-zora-ink)]/30 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="border-2 border-[var(--color-zora-ink)]/10 rounded-xl bg-[var(--color-zora-alabaster)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-zora-ink)]/30 transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Subject</label>
              <select 
                id="subject" 
                className="border-2 border-[var(--color-zora-ink)]/10 rounded-xl bg-[var(--color-zora-alabaster)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-zora-ink)]/30 transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="order">Order Support</option>
                <option value="custom">Custom Cake Request</option>
                <option value="catering">Catering & Events</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="border-2 border-[var(--color-zora-ink)]/10 rounded-xl bg-[var(--color-zora-alabaster)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-zora-ink)]/30 transition-colors resize-none"
              />
            </div>
            
            <Button type="button" size="lg" className="mt-4 w-full md:w-auto self-start shadow-sm">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-12 bg-[var(--color-zora-clay)] p-8 md:p-12 rounded-3xl shadow-sm">
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]/70">Bakery & Orders</h3>
            <p className="mb-2 text-2xl font-serif font-bold text-[var(--color-zora-ink)]">hello@zorabakes.com</p>
            <p className="text-[var(--color-zora-ink)]/80 font-medium">Mon - Sun, 8am - 8pm EST</p>
          </div>
          
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]/70">Events & Catering</h3>
            <p className="mb-2 text-2xl font-serif font-bold text-[var(--color-zora-ink)]">events@zorabakes.com</p>
            <p className="text-[var(--color-zora-ink)]/80 font-medium">For weddings and large gatherings</p>
          </div>
          
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]/70">Flagship Bakery</h3>
            <p className="mb-2 text-2xl font-serif font-bold text-[var(--color-zora-ink)]">Zora Bakes West Village</p>
            <p className="text-[var(--color-zora-ink)]/80 font-medium leading-relaxed">
              401 Bleecker Street<br />
              New York, NY 10014<br />
              United States
            </p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-[var(--color-zora-ink)]/10">
            <p className="text-sm italic font-medium text-[var(--color-zora-ink)]/80">
              "We aim to respond to all sweet inquiries within 24 hours."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
