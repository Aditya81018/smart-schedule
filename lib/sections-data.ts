export type Section = {
  id: string
  department: string
  year: string
  subjects: string[]
}

export const DEFAULT_SECTIONS: Section[] = [
  { id: "sec1", department: "CSE", year: "1", subjects: ["Data Structures", "Database Systems"] },
  { id: "sec2", department: "CSE", year: "2", subjects: ["Web Development", "Software Engineering"] },
  { id: "sec3", department: "ECE", year: "1", subjects: ["Programming Lab"] },
  { id: "sec4", department: "ME", year: "3", subjects: ["Thermodynamics"] },
  { id: "sec5", department: "MBA", year: "1", subjects: ["Management Principles"] },
]
