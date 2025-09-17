"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"

const departments = [
  {
    name: "Computer Science Department",
    schedule: {
      Monday: {
        "9:00-11:00": { subject: "Data Structures", professor: "Dr. Smith", room: "CS-101" },
        "11:00-1:00": { subject: "Database Systems", professor: "Prof. Johnson", room: "CS-201" },
        "1:00-3:00": { subject: "Machine Learning", professor: "Dr. Wilson", room: "CS-401" },
      },
      Tuesday: {
        "9:00-11:00": { subject: "Web Development", professor: "Prof. Miller", room: "CS-103" },
        "11:00-1:00": { subject: "Software Engineering", professor: "Dr. Brown", room: "CS-202" },
        "1:00-3:00": { subject: "Cloud Computing", professor: "Dr. Martinez", room: "CS-402" },
      },
      Wednesday: {
        "9:00-11:00": { subject: "Programming Lab", professor: "Dr. Lee", room: "CS-Lab1" },
        "11:00-1:00": { subject: "Algorithms", professor: "Prof. Davis", room: "CS-203" },
        "1:00-3:00": { subject: "Blockchain", professor: "Dr. Hall", room: "CS-403" },
      },
    },
  },
  {
    name: "Business Administration Department",
    schedule: {
      Monday: {
        "9:00-11:00": { subject: "Marketing", professor: "Prof. Adams", room: "BA-101" },
        "11:00-1:00": { subject: "Finance", professor: "Dr. Taylor", room: "BA-201" },
        "1:00-3:00": { subject: "Business Law", professor: "Dr. Foster", room: "BA-401" },
      },
      Tuesday: {
        "9:00-11:00": { subject: "Accounting", professor: "Ms. Green", room: "BA-103" },
        "11:00-1:00": { subject: "Operations Mgmt", professor: "Prof. White", room: "BA-202" },
        "1:00-3:00": { subject: "Entrepreneurship", professor: "Prof. Lopez", room: "BA-402" },
      },
      Wednesday: {
        "9:00-11:00": { subject: "Statistics", professor: "Dr. Moore", room: "BA-105" },
        "11:00-1:00": { subject: "Strategic Mgmt", professor: "Ms. Clark", room: "BA-203" },
        "1:00-3:00": { subject: "Project Management", professor: "Ms. Roberts", room: "BA-403" },
      },
    },
  },
  {
    name: "Engineering Department",
    schedule: {
      Monday: {
        "9:00-11:00": { subject: "Thermodynamics", professor: "Prof. Singh", room: "ENG-101" },
        "11:00-1:00": { subject: "Fluid Mechanics", professor: "Dr. Kumar", room: "ENG-201" },
        "1:00-3:00": { subject: "Power Systems", professor: "Dr. Allen", room: "ENG-401" },
      },
      Tuesday: {
        "9:00-11:00": { subject: "Circuit Analysis", professor: "Ms. Bell", room: "ENG-103" },
        "11:00-1:00": { subject: "Control Systems", professor: "Prof. Patel", room: "ENG-202" },
        "1:00-3:00": { subject: "Automation", professor: "Prof. Fisher", room: "ENG-402" },
      },
      Wednesday: {
        "9:00-11:00": { subject: "Engineering Lab", professor: "Dr. Gray", room: "ENG-Lab1" },
        "11:00-1:00": { subject: "Materials Science", professor: "Dr. Shah", room: "ENG-203" },
        "1:00-3:00": { subject: "Innovation", professor: "Ms. Long", room: "ENG-403" },
      },
    },
  },
]

const timeSlots = ["9:00-11:00", "11:00-1:00", "1:00-3:00"]
const days = ["Monday", "Tuesday", "Wednesday"]

export function HeroSection() {
  const [currentDepartment, setCurrentDepartment] = useState(0)
  const [highlightedCell, setHighlightedCell] = useState({ day: "", time: "" })

  useEffect(() => {
    const departmentInterval = setInterval(() => {
      setCurrentDepartment((prev) => (prev + 1) % departments.length)
    }, 5000)

    const highlightInterval = setInterval(() => {
      const randomDay = days[Math.floor(Math.random() * days.length)]
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)]
      setHighlightedCell({ day: randomDay, time: randomTime })
      setTimeout(() => setHighlightedCell({ day: "", time: "" }), 1500)
    }, 2500)

    return () => {
      clearInterval(departmentInterval)
      clearInterval(highlightInterval)
    }
  }, [])

  const currentSchedule = departments[currentDepartment]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Effortless Scheduling for <span className="text-primary">Colleges</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Create conflict-free timetables with our intelligent scheduling system. Input your data, generate
              optimized schedules, and make adjustments with automatic conflict resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={"/auth/login"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link href={"/auth/register"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary bg-transparent text-primary"
                  >
                    Register your college
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <motion.h3
                  key={currentDepartment}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg font-semibold text-card-foreground"
                >
                  {currentSchedule.name}
                </motion.h3>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-4 gap-2 w-full">
                  {/* Header row with time slots */}
                  <div className="p-3 text-sm font-medium text-muted-foreground"></div>
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="p-3 text-sm font-medium text-center text-muted-foreground bg-muted/30 rounded"
                    >
                      {time}
                    </div>
                  ))}

                  {/* Days and schedule cells */}
                  {days.map((day) => (
                    <motion.div
                      key={`${currentDepartment}-${day}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: days.indexOf(day) * 0.1 }}
                      className="contents"
                    >
                      {/* Day label */}
                      <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/30 rounded flex items-center justify-center">
                        {day}
                      </div>

                      {/* Time slot cells for this day */}
                      {timeSlots.map((time) => {
                        // @ts-ignore
                        const classInfo = currentSchedule.schedule[day]?.[time]
                        const isHighlighted = highlightedCell.day === day && highlightedCell.time === time

                        return (
                          <motion.div
                            key={`${day}-${time}`}
                            className={`p-3 rounded text-sm transition-all duration-300 min-h-[80px] flex flex-col justify-center ${isHighlighted
                              ? "bg-primary/20 border border-primary shadow-md scale-105"
                              : classInfo
                                ? "bg-background border border-border hover:bg-muted/30"
                                : "bg-muted/20 border border-muted"
                              }`}
                            whileHover={{ scale: classInfo ? 1.02 : 1 }}
                          >
                            {classInfo ? (
                              <div className="space-y-1">
                                <div className="font-semibold text-card-foreground leading-tight truncate">
                                  {classInfo.subject}
                                </div>
                                <div className="text-muted-foreground text-xs truncate">{classInfo.professor}</div>
                                <div className="text-muted-foreground text-xs truncate">{classInfo.room}</div>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground">Free Period</div>
                            )}
                            {isHighlighted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
                              />
                            )}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
