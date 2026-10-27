
import { useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Aarav Patil", rollNo: "101", course: "BCA", year: "2nd Year", email: "aarav@example.com" },
  { id: 2, name: "Priya Sharma", rollNo: "102", course: "BSc CS", year: "3rd Year", email: "priya@example.com" },
  { id: 3, name: "Rohan Deshmukh", rollNo: "103", course: "BCA", year: "1st Year", email: "rohan@example.com" },
];

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    course: "",
    year: "",
    email: "",
  });

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.rollNo} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setForm({ name: "", rollNo: "", course: "", year: "", email: "" });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(student) {
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      course: student.course,
      year: student.year,
      email: student.email,
    });
    setEditingId(student.id);
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingId
            ? { ...form, id: editingId }
            : student
        )
      );
    } else {
      setStudents((previous) => [
        ...previous,
        { ...form, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function deleteStudent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmed) {
      setStudents((previous) =>
        previous.filter((student) => student.id !== id)
      );
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>StudentHub</h2>
            <p>Management System</p>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>
        <div className="menu-item active">▦ &nbsp; Dashboard</div>
        <div className="menu-item">♙ &nbsp; Students</div>

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div>
            <strong>Admin</strong>
            <p>Administrator</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">STUDENT MANAGEMENT</p>
            <h1>Dashboard</h1>
          </div>
          <span className="admin-badge">Admin Panel</span>
        </header>

        <section className="welcome">
          <div>
            <h2>Welcome back, Admin!</h2>
            <p>Manage your students easily from one place.</p>
          </div>
          <button className="primary-btn" onClick={openAddForm}>
            + Add Student
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon blue">♙</span>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Courses</p>
            <h2>{new Set(students.map((s) => s.course)).size}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-icon purple">⌕</span>
            <p>Search Results</p>
            <h2>{filteredStudents.length}</h2>
          </div>
        </section>

        <section className="table-card">
          <div className="table-heading">
            <div>
              <h2>All Students</h2>
              <p>View and manage student records</p>
            </div>
            <input
              className="search-input"
              type="search"
              placeholder="Search name, roll no, course..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ROLL NO.</th>
                  <th>COURSE</th>
                  <th>YEAR</th>
                  <th>EMAIL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-name">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{student.name}</strong>
                      </div>
                    </td>
                    <td>{student.rollNo}</td>
                    <td><span className="course-tag">{student.course}</span></td>
                    <td>{student.year}</td>
                    <td>{student.email}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => openEditForm(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showForm && (
          <div className="modal-backdrop">
            <section className="student-modal">
              <div className="modal-heading">
                <div>
                  <h2>{editingId !== null ? "Edit Student" : "Add Student"}</h2>
                  <p>Enter the student's details below.</p>
                </div>
                <button
                  className="close-btn"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label>
                  Full Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </label>

                <label>
                  Roll Number
                  <input
                    name="rollNo"
                    value={form.rollNo}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    required
                  />
                </label>

                <label>
                  Course
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select course</option>
                    <option value="BCA">BCA</option>
                    <option value="BSc CS">BSc Computer Science</option>
                    <option value="BTech">BTech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </label>

                <label>
                  Year
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </label>

                <label className="full-width">
                  Email Address
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                  />
                </label>

                <div className="form-actions full-width">
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button className="primary-btn" type="submit">
                    {editingId !== null ? "Save Changes" : "Add Student"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
