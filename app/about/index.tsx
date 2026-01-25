"use client"

import { useState } from "react"
import { MapPin, Heart, ShieldCheck, Users, ChevronDown } from "lucide-react"
import Image from "next/image"

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const values = [
    {
      icon: Heart,
      title: "Carefully Selected Fabrics",
      description: "Every piece is chosen with attention to quality, comfort, and modesty in mind."
    },
    {
      icon: ShieldCheck,
      title: "Physical Store You Can Visit",
      description: "We're a real store at Big Plaza, Oluyole. Come see our products before you buy."
    },
    {
      icon: Users,
      title: "Honest Pricing",
      description: "Fair prices with no hidden costs. What you see is what you pay."
    },
    {
      icon: MapPin,
      title: "Customer-Focused Service",
      description: "Your satisfaction matters. We're here to help with every purchase."
    }
  ]

  const faqs = [
    {
      question: "Do you have a physical store?",
      answer: "Yes! We're located at No. 22 Big Plaza, Oluyole, Ibadan. You're welcome to visit us during business hours to see our collection in person."
    },
    {
      question: "Do you sell ready-made and custom-sewn items?",
      answer: "We offer both ready-made abayas, jalabiyas, hijabs, caps, and prayer mats, as well as custom sewing services. Bring your design or choose from our styles."
    },
    {
      question: "How do I place an order?",
      answer: "You can browse our products online and add them to your cart, then complete checkout with your delivery details. You can also visit our store in person or call us directly."
    },
    {
      question: "Can I visit the store before buying?",
      answer: "Absolutely! We encourage you to visit us at Big Plaza, Oluyole. You can see the fabrics, try items, and speak with our team before making a decision."
    },
    {
      question: "Do you deliver outside Ibadan?",
      answer: "Yes, we deliver across Nigeria. Delivery times and fees vary by location. We'll provide accurate estimates at checkout."
    }
  ]

  return (
    <div className="flex-1">
      {/* Hero Image Section */}
      <section className="w-full px-4 pt-4 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl group">
          <div className="aspect-[3/2] relative">
            <Image
              src="/physical-store.webp"
              alt="Bikudiratillah Store"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Soft blue glow on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500 pointer-events-none" />
        </div>
      </section>

      {/* About the Business Section */}
      <section className="max-w-3xl mx-auto px-4 py-8  text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          About Our Store
        </h1>
        <div className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Bikudiratillah is a trusted local store in Ibadan, specializing in modest Islamic clothing and accessories. We offer a carefully curated selection of abayas, jalabiyas, hijabs, prayer caps, and prayer mats — all chosen with care and respect for quality.
          </p>
          <p>
            Located at Big Plaza in Oluyole, we are a physical store you can visit, touch the fabrics, and speak with our team. Whether you're looking for ready-made pieces or custom sewing services, we're here to serve you with honesty and care.
          </p>
        </div>
      </section>

      {/* What We Value Section */}
      <section className="py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6 px-4 lg:px-8">
          Why Choose Us
        </h2>
        <div className="overflow-x-auto scrollbar-hide pt-2">
          <div className="flex gap-4 lg:gap-6 px-4 lg:px-8 pb-2">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="glow-blue flex-shrink-0 w-64 h-64 lg:w-72 lg:h-72 glass-card rounded-2xl p-6 hover:glass-strong transition-all duration-300 group flex flex-col items-center justify-center text-center"
                >
                  <div className="glass-interactive rounded-full p-4 lg:p-5 group-hover:bg-primary/20 transition-colors mb-4">
                    <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location & Delivery Section */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="glass-strong rounded-2xl p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 glass-interactive rounded-full mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4  ">
            Visit Our Store
          </h2>
          {/* <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            We're located in the heart of Oluyole, easy to find and welcoming to all. Stop by to see our collection in person.
          </p> */}
          <div className="glass-interactive rounded-xl p-6 inline-block">
            <p className="text-lg font-medium text-foreground mb-2">
              No. 22 Big Plaza, Oluyole, Ibadan
            </p>
            <p className="text-sm text-muted-foreground">
              Oyo State, Nigeria
            </p>
          </div>
          <div className="mt-3 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Delivery Available
            </h3>
            <p className="text-foreground/70 text-sm">
              We deliver across Nigeria. Delivery fees and times vary by location.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Netflix Style */}
      <section className="max-w-4xl mx-auto px-4 pt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="glass-strong rounded-xl overflow-hidden hover:glass-interactive transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-medium text-foreground pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-foreground/60 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'
                    }`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-foreground/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-5" />
    </div>
  )
}

export default About