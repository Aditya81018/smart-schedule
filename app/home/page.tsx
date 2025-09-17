export default function HomeIndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-medium mb-2">Getting Started</h2>
          <p className="text-sm text-muted-foreground">
            Welcome to Smart Schedule. Use the sidebar to navigate to different sections. This dashboard will soon show your timetable, classes, and quick actions.
          </p>
        </section>
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="font-medium mb-2">Next Steps</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Set up departments and courses</li>
            <li>Add classrooms and capacities</li>
            <li>Invite staff and manage allocations</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
