import ScrollReveal from "./ScrollReveal.jsx";

const processSteps = [
  { id: "p1", title: "Discovery", description: "We learn your business, your customers, and what the website needs to achieve." },
  { id: "p2", title: "Planning", description: "We map out structure, content and features into a clear project roadmap." },
  { id: "p3", title: "Wireframing", description: "Low-fidelity layouts define how visitors will move through your site." },
  { id: "p4", title: "Design", description: "A custom visual design is crafted around your brand — not a generic template." },
  { id: "p5", title: "Development", description: "Our engineers build a fast, secure and responsive website from the ground up." },
  { id: "p6", title: "Testing", description: "Every page is tested across devices, browsers and real-world conditions." },
  { id: "p7", title: "Deployment", description: "Your website goes live on a secure, properly configured hosting environment." },
  { id: "p8", title: "Support", description: "We stay on to monitor, maintain and improve your website after launch." },
];

export default function ProcessTimeline() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <ScrollReveal direction="up" delay={50}>
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-16">
          <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-2 sm:mb-3 inline-block">
            OUR PROCESS
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            From Idea to a Live Website
          </h2>
          <p className="text-mist text-xs sm:text-lg max-w-xl mx-auto">
            A clear, structured 8-step engineering process so you always know what happens next.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid of Steps with Connected Flow styling */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, idx) => (
          <ScrollReveal key={step.id} direction="up" delay={40 * ((idx % 4) + 1)}>
            <div className="relative h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 p-6 backdrop-blur transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1 shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-grad-primary text-void font-mono font-bold text-sm shadow-md">
                    0{idx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-cyan/60 uppercase tracking-widest">
                    Phase {idx + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-paper group-hover:text-cyan transition-colors mb-2">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  {step.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
