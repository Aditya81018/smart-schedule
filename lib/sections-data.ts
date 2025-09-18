export type Section = {
  id: string
  department: string
  year: string
  subjects: string[]
}

export const DEFAULT_SECTIONS: Section[] = [
  { id: "sec1", department: "CSE", year: "1", subjects: ["SUB001", "SUB002"] },
  { id: "sec2", department: "CSE", year: "2", subjects: ["SUB003", "SUB004"] },
  { id: "sec3", department: "ECE", year: "1", subjects: ["SUB001"] },
  { id: "sec4", department: "ME", year: "3", subjects: ["SUB005"] },
  { id: "sec5", department: "MBA", year: "1", subjects: [] },
]
