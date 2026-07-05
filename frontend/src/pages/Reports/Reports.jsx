import React from "react";
import "./Reports.css";

const reportAreas = [
  "Attendance activity",
  "Timetable activity",
  "Events & registrations",
  "Announcements reach",
  "Notes & resources",
  "Assignments workflow",
  "Club activity",
  "Community moderation",
  "Teacher responsibilities",
];

const Reports = () => {
  return (
    <main className="reports-page">
      <div className="breadcrumb">Home / Activity Reports</div>
      <section className="reports-hero">
        <span>University activity</span>
        <h1>Activity reports</h1>
        <p>
          This section is for university activities and operational reporting, not exam/result management.
          Use it to track attendance, timetable, events, announcements, notes, assignments, clubs and moderation.
        </p>
      </section>

      <section className="reports-grid">
        {reportAreas.map((area) => (
          <article className="report-card" key={area}>
            <h3>{area}</h3>
            <p>Summary, filters and export-ready reporting can be expanded here.</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Reports;
