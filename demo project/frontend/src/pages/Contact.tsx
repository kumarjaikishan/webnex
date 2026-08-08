import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { submitLead } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  businessType: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us | Lumix Digital";
  }, []);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    try {
      await submitLead({ ...values, source: "contact-page" });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's Talk About Your Project"
        subtitle="Fill out the form and our team will get back to you with a free quote."
      />
      <section className="section-pad bg-white">
        <div className="container-lx grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary"><MapPin size={20} /></div>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">Address</p>
                  <p className="font-body text-sm text-ink/60">Bihar Sharif, Nalanda, Bihar, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary"><Phone size={20} /></div>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">Phone</p>
                  <p className="font-body text-sm text-ink/60">+91-XXXXXXXXXX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary"><Mail size={20} /></div>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">Email</p>
                  <p className="font-body text-sm text-ink/60">hello@lumixdigital.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary"><Clock size={20} /></div>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">Working Hours</p>
                  <p className="font-body text-sm text-ink/60">Mon–Sat, 10:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 h-64 overflow-hidden rounded-xl2 border border-ink/[0.06]">
              <iframe
                title="Lumix Digital Location"
                width="100%"
                height="100%"
                loading="lazy"
                src="https://www.google.com/maps?q=Bihar+Sharif,+Nalanda,+Bihar&output=embed"
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="card-lx p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 size={44} className="text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank you!</h3>
                <p className="mt-2 font-body text-sm text-ink/60">We've received your message and will get back to you shortly.</p>
                <button onClick={() => setStatus("idle")} className="btn-secondary mt-6">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-ui text-sm font-medium text-ink">Full Name</label>
                    <input {...register("name")} className="mt-2 w-full rounded-lg border border-ink/10 px-4 py-3 font-body text-sm focus:border-primary/40 focus:outline-none" placeholder="Your name" />
                    {errors.name && <p className="mt-1 font-body text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="font-ui text-sm font-medium text-ink">Phone Number</label>
                    <input {...register("phone")} className="mt-2 w-full rounded-lg border border-ink/10 px-4 py-3 font-body text-sm focus:border-primary/40 focus:outline-none" placeholder="+91" />
                    {errors.phone && <p className="mt-1 font-body text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="font-ui text-sm font-medium text-ink">Email (Optional)</label>
                  <input {...register("email")} className="mt-2 w-full rounded-lg border border-ink/10 px-4 py-3 font-body text-sm focus:border-primary/40 focus:outline-none" placeholder="you@business.com" />
                  {errors.email && <p className="mt-1 font-body text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="font-ui text-sm font-medium text-ink">Business Type</label>
                  <input {...register("businessType")} className="mt-2 w-full rounded-lg border border-ink/10 px-4 py-3 font-body text-sm focus:border-primary/40 focus:outline-none" placeholder="e.g. Restaurant, Clinic, School" />
                </div>
                <div>
                  <label className="font-ui text-sm font-medium text-ink">Message</label>
                  <textarea {...register("message")} rows={4} className="mt-2 w-full rounded-lg border border-ink/10 px-4 py-3 font-body text-sm focus:border-primary/40 focus:outline-none" placeholder="Tell us about your project..." />
                </div>
                {status === "error" && (
                  <p className="font-body text-sm text-red-500">Something went wrong. Please try again or WhatsApp us directly.</p>
                )}
                <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center">
                  {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : "Get Free Quote"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
