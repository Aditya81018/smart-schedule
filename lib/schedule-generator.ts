import type { Section } from "./sections-data"
import type { TimetableSchedule } from "@/components/timetable-grid"

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateConflictFreeSchedules(
  sections: Section[],
  days: string[],
  periods: string[],
  opts?: { subjects?: string[]; professors?: string[]; rooms?: string[] }
): Record<string, TimetableSchedule> {
  const subjectsPool = opts?.subjects ?? [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Web Development",
    "Machine Learning",
    "Software Engineering",
    "Operating Systems",
    "Networks",
    "Thermodynamics",
    "Statistics",
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
  ]
  const roomsPool = opts?.rooms ?? ["A-101", "A-102", "B-201", "B-202", "C-301", "C-302", "Lab-1", "Lab-2"]

  // For each slot (day-period) track used professors and rooms to avoid conflict across sections
  const usedProfessors: Record<string, Set<string>> = {}
  const usedRooms: Record<string, Set<string>> = {}

  function slotKey(day: string, period: string) {
    return `${day}__${period}`
  }

  const out: Record<string, TimetableSchedule> = {}

  for (const sec of sections) {
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

        // Prefer subjects declared in section if any, else from pool
        const subjectCandidates = sec.subjects.length ? sec.subjects : subjectsPool

        // Try to pick a subject/prof/room triplet that doesn't conflict
        let attempt = 0
        let assigned = false
        let chosen: { subject: string; professor: string; room: string } | null = null
        while (attempt < 50 && !assigned) {
          const subject = pickRandom(subjectCandidates)
          const professor = pickRandom(professorsPool)
          const room = pickRandom(roomsPool)

          if (usedProfessors[key].has(professor) || usedRooms[key].has(room)) {
            attempt++
            continue
          }

          // assign
          usedProfessors[key].add(professor)
          usedRooms[key].add(room)
          chosen = { subject, professor, room }
          assigned = true
        }

        if (chosen) schedule[day][period] = chosen
        else schedule[day][period] = {
          subject: pickRandom(subjectsPool),
          professor: pickRandom(professorsPool),
          room: pickRandom(roomsPool),
        }
      }
    }
    out[sec.id] = schedule
  }

  return out
}
