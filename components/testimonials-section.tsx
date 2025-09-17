"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Academic Director",
    institution: "Springfield University",
    content:
      "Smart Schedule transformed our timetabling process. What used to take weeks now takes hours, and conflicts are virtually eliminated.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Registrar",
    institution: "Tech Valley College",
    content:
      "The automated conflict resolution is incredible. We can make last-minute changes without worrying about creating scheduling disasters.",
    rating: 5,
  },
  {
    name: "Prof. Emily Rodriguez",
    role: "Department Head",
    institution: "Riverside Community College",
    content:
      "Finally, a scheduling system that understands the complexity of academic institutions. Highly recommended for any college.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Trusted by Colleges Nationwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            See what academic administrators are saying about Smart Schedule.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</blockquote>
                  <div className="border-t border-border pt-4">
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.institution}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
