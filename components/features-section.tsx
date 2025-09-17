"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Zap, Shield, Edit3, Calendar, Users } from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Smart Data Input",
    description:
      "Easily input professors, classrooms, sections, timeslots, and subjects. Our system validates and organizes your data automatically.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Automated Generation",
    description:
      "Generate optimized timetables instantly with our intelligent algorithm that considers all constraints and preferences.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Conflict-Free Scheduling",
    description:
      "Advanced conflict detection ensures no professor or classroom is double-booked. Get error-free schedules every time.",
    color: "text-primary",
  },
  {
    icon: Edit3,
    title: "Manual Adjustments",
    description:
      "Make changes with confidence. Our system automatically readjusts the entire schedule to maintain conflict-free status.",
    color: "text-primary",
  },
  {
    icon: Calendar,
    title: "Flexible Timeslots",
    description:
      "Support for custom time periods, break times, and special scheduling requirements unique to your institution.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Multi-User Access",
    description:
      "Collaborate with your team. Different access levels for administrators, department heads, and faculty members.",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Powerful Features for Modern Colleges
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Everything you need to create, manage, and optimize your college timetables with ease and precision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-card flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
