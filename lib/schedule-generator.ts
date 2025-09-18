import type { Section } from "./sections-data"
import type { TimetableSchedule } from "@/components/timetable-grid"

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleArray<T>(arr: T[]) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateConflictFreeSchedules(
  sections: Section[],
  days: string[],
  periods: string[],
  opts?: { subjects?: string[]; professors?: string[]; rooms?: string[] }
): Record<string, TimetableSchedule> {
  const subjectsPool = opts?.subjects ?? [
    "Calculus",
    "Linear Algebra",
    "Discrete Mathematics",
    "Physics I",
    "Physics II",
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Biology",
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Web Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Software Engineering",
    "Operating Systems",
    "Computer Networks",
    "Thermodynamics",
    "Fluid Mechanics",
    "Statistics",
    "Numerical Methods",
    "Embedded Systems",
    "Control Systems",
    "Digital Signal Processing",
    "Human Computer Interaction",
    "Business Management",
    "Marketing",
  ]
  const professorsPool = opts?.professors ?? [
    "Dr. Smith",
    "Prof. Johnson",
    "Dr. Wilson",
    "Prof. Miller",
    "Dr. Brown",
    "Dr. Martinez",
    "Dr. Lee",
    "Prof. Davis",
    "Dr. Hall",
    "Prof. Adams",
    "Dr. Taylor",
    "Dr. Gupta",
    "Prof. Singh",
    "Dr. Patel",
    "Dr. Rao",
  ]
  const roomsPool = opts?.rooms ?? [
    "A-101",
    "A-102",
    "B-201",
    "B-202",
    "C-301",
    "C-302",
    "Lab-1",
    "Lab-2",
    "Sem-1",
    "Sem-2",
  ]

  // For each slot (day-period) track used professors and rooms to avoid conflict across sections
  const usedProfessors: Record<string, Set<string>> = {}
  const usedRooms: Record<string, Set<string>> = {}

  function slotKey(day: string, period: string) {
    return `${day}__${period}`
  }

  const out: Record<string, TimetableSchedule> = {}

  for (const sec of sections) {
    // prepare a shuffled subject list for this section to increase variety
    const pool = sec.subjects && sec.subjects.length ? shuffleArray(sec.subjects.concat(subjectsPool)) : shuffleArray(subjectsPool)
    let poolIndex = 0

    const schedule: TimetableSchedule = {}
    for (const day of days) {
      schedule[day] = {}
      for (const period of periods) {
        if (period.toLowerCase() === "break") {
          schedule[day][period] = null
          continue
        }

        const key = slotKey(day, period)
        if (!usedProfessors[key]) usedProfessors[key] = new Set()
        if (!usedRooms[key]) usedRooms[key] = new Set()

        // select next subject from pool (cycle when needed)
        const subject = pool[poolIndex % pool.length]
        poolIndex++

        // Try to pick a professor and room that don't conflict at this slot
        let attempt = 0
        let assigned = false
        let chosen: { subject: string; professor: string; room: string } | null = null
        while (attempt < 60 && !assigned) {
          const professor = pickRandom(professorsPool)
          const room = pickRandom(roomsPool)

          if (usedProfessors[key].has(professor) || usedRooms[key].has(room)) {
            attempt++
            continue
          }

          usedProfessors[key].add(professor)
          usedRooms[key].add(room)
          chosen = { subject, professor, room }
          assigned = true
        }

        if (chosen) schedule[day][period] = chosen
        else schedule[day][period] = {
          subject,
          professor: pickRandom(professorsPool),
          room: pickRandom(roomsPool),
        }
      }
    }
    out[sec.id] = schedule
  }

  return out
}
