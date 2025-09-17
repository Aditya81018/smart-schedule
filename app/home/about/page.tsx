export default function AboutCollegePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">About the College</h1>
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">Stellar Institute of Technology</h2>
          <p className="text-sm text-muted-foreground">Established 1998 • NAAC A+ • AICTE Approved</p>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-6">
          <section>
            <h3 className="font-medium mb-2">Address</h3>
            <p className="text-sm text-muted-foreground">
              123 Knowledge Park, Sector 5, New City, State 456789
            </p>
          </section>
          <section>
            <h3 className="font-medium mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">info@stellartech.edu • +91 98765 43210</p>
          </section>
          <section>
            <h3 className="font-medium mb-2">Departments</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Computer Science and Engineering</li>
              <li>Electrical Engineering</li>
              <li>Mechanical Engineering</li>
              <li>Management Studies</li>
            </ul>
          </section>
          <section>
            <h3 className="font-medium mb-2">Facilities</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Central Library with 50,000+ volumes</li>
              <li>State-of-the-art labs and research centers</li>
              <li>Auditorium, Sports Complex, and Hostels</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
