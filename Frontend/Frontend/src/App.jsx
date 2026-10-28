
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/students`;

const emptyForm = {
  name: "",
  rollNo: "",
  course: "",
  year: "",
  email: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load students. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.rollNo} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
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
    setEditingId(student._id);
    setError("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      await loadStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not save student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      await loadStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not delete student. Please try again."
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

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              marginBottom: "18px",
              borderRadius: "8px",
              background: "#fff0f0",
              color: "#b42318",
              fontSize: "13px",
            }}
          >
            {error}
            <button
              onClick={() => setError("")}
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                color: "inherit",
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon blue">♙</span>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Courses</p>
            <h2>
              {new Set(students.map((student) => student.course)).size}
            </h2>
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No students found. Add your first student.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-name">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{student.name}</strong>
                        </div>
                      </td>

                      <td>{student.rollNo}</td>
                      <td>
                        <span className="course-tag">
                          {student.course}
                        </span>
                      </td>
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
                            onClick={() => deleteStudent(student._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                  <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
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
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Add Student"}
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
