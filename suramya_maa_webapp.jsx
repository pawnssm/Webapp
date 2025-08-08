import React, { useState, useEffect } from "react";

// Suramya – Maa Foundation — Single-file React app (Tailwind CSS assumed)
// Features: Home, Programs, Bookings (Self-study + Training), Donate, About, Contact, Admin demo
// Notes: This is a single-file component intended for quick preview. For production:
//  - Split into components, add routing (react-router), backend for payments & auth.

export default function App() {
  const initialCourses = [
    { id: 1, title: "Digital Literacy (1 month)", fee: 1500, seats: 20 },
    { id: 2, title: "DCA (6 months)", fee: 6000, seats: 15 },
    { id: 3, title: "MS Office Essentials (2 months)", fee: 3000, seats: 10 },
  ];

  const [page, setPage] = useState("home");
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem("sm_courses");
    return stored ? JSON.parse(stored) : initialCourses;
  });
  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem("sm_bookings");
    return stored ? JSON.parse(stored) : [];
  });
  const [studySeats, setStudySeats] = useState(() => {
    const stored = localStorage.getItem("sm_studySeats");
    return stored ? Number(stored) : 60;
  });

  // Simple admin demo state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");

  useEffect(() => {
    localStorage.setItem("sm_courses", JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem("sm_bookings", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem("sm_studySeats", String(studySeats));
  }, [studySeats]);

  function bookCourse(courseId, student) {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { ok: false, msg: "Course not found" };
    if (course.seats <= 0) return { ok: false, msg: "No seats available" };

    // reduce seat
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, seats: c.seats - 1 } : c)));

    const booking = {
      id: Date.now(),
      type: "course",
      courseId,
      student,
      date: new Date().toISOString(),
    };
    setBookings((b) => [booking, ...b]);
    return { ok: true, booking };
  }

  function bookStudySeat(student, hours = 3) {
    if (studySeats <= 0) return { ok: false, msg: "No study seats available" };
    setStudySeats((s) => s - 1);
    const booking = {
      id: Date.now(),
      type: "study",
      student,
      hours,
      date: new Date().toISOString(),
    };
    setBookings((b) => [booking, ...b]);
    return { ok: true, booking };
  }

  function addCourse(newCourse) {
    setCourses((c) => [...c, { ...newCourse, id: Date.now() }]);
  }

  function clearData() {
    if (!confirm("Clear all demo data? This can't be undone in this preview.")) return;
    localStorage.removeItem("sm_courses");
    localStorage.removeItem("sm_bookings");
    localStorage.removeItem("sm_studySeats");
    setCourses(initialCourses);
    setBookings([]);
    setStudySeats(60);
  }

  // Lightweight components inside file
  const Nav = () => (
    <header className="bg-gradient-to-r from-sky-700 to-indigo-700 text-white p-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Suramya – Maa Foundation</h1>
          <div className="text-xs opacity-90">Empowering Minds, Enriching Lives</div>
        </div>
        <nav className="space-x-3">
          <button onClick={() => setPage("home")} className="hover:underline">Home</button>
          <button onClick={() => setPage("programs")} className="hover:underline">Programs</button>
          <button onClick={() => setPage("book") } className="hover:underline">Book</button>
          <button onClick={() => setPage("donate")} className="hover:underline">Donate</button>
          <button onClick={() => setPage("about")} className="hover:underline">About</button>
          <button onClick={() => setPage("contact")} className="hover:underline">Contact</button>
          <button onClick={() => setPage("admin")} className="hover:underline">Admin</button>
        </nav>
      </div>
    </header>
  );

  const Home = () => (
    <section className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold">Welcome to Suramya – Maa Foundation</h2>
          <p className="mt-3 text-gray-700">A community hub for computer training, self-study, and social upliftment in Varanasi.</p>
          <ul className="mt-4 list-disc ml-5 text-gray-700">
            <li>30-computer training lab (paid + NGO classes)</li>
            <li>60-seat self-study hall with membership plans</li>
            <li>Scholarships, women & senior citizen programs</li>
          </ul>
          <div className="mt-4">
            <button onClick={() => setPage("programs")} className="px-4 py-2 bg-indigo-600 text-white rounded">Explore Programs</button>
          </div>
        </div>
        <div className="p-6 rounded shadow bg-white">
          <img alt="facility-placeholder" src="https://placehold.co/600x400?text=Suramya+Facility" className="w-full h-64 object-cover rounded" />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Computer Training</h3>
          <p className="mt-2 text-sm text-gray-600">Paid courses + free NGO batches. Placement support included.</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Self-Study Hall</h3>
          <p className="mt-2 text-sm text-gray-600">60 seats, quiet environment, Wi-Fi & charging.</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold">Community Programs</h3>
          <p className="mt-2 text-sm text-gray-600">Scholarships, women's digital literacy, senior citizen classes.</p>
        </div>
      </div>
    </section>
  );

  const Programs = () => (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Programs & Courses</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-gray-600">Fee: ₹{c.fee} · Seats left: {c.seats}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  const name = prompt("Enter student full name:");
                  if (!name) return alert("Name required");
                  const res = bookCourse(c.id, { name });
                  if (res.ok) alert("Booked! Check Admin > Bookings for details (demo)");
                  else alert(res.msg);
                }}
                className="px-3 py-1 bg-sky-600 text-white rounded text-sm"
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const Book = () => {
    const [name, setName] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? null);

    return (
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Book a Seat</h2>
        <div className="mt-4 bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border rounded w-full" />

          <label className="block text-sm font-medium mt-3">Choose</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(Number(e.target.value))} className="mt-1 p-2 border rounded w-full">
            <option value="study">Self-Study Hall (membership)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title} — ₹{c.fee} · Seats {c.seats}</option>
            ))}
          </select>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                if (!name) return alert("Enter name");
                if (String(selectedCourse) === "study") {
                  const r = bookStudySeat({ name }, 4);
                  if (r.ok) alert("Study seat booked (demo). Check Admin for booking list.");
                  else alert(r.msg);
                } else {
                  const r = bookCourse(Number(selectedCourse), { name });
                  if (r.ok) alert("Course enrollment successful (demo)");
                  else alert(r.msg);
                }
                setName("");
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >Confirm Booking</button>

            <button onClick={() => { setName(""); setSelectedCourse(courses[0]?.id ?? null); }} className="px-3 py-2 border rounded">Reset</button>
          </div>

          <div className="mt-4 text-sm text-gray-600">Note: This is a demo booking using localStorage. Integrate a backend & payment gateway for production.</div>
        </div>
      </section>
    );
  };

  const Donate = () => {
    const [donor, setDonor] = useState("");
    const [amount, setAmount] = useState(500);
    function submit() {
      if (!donor) return alert("Enter name");
      alert(`Thank you ${donor}! Demo donation of ₹${amount} recorded.`);
      // In production, send to payments endpoint
      setDonor("");
      setAmount(500);
    }

    return (
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Support Our Work</h2>
        <div className="mt-4 bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 p-2 border rounded w-full" value={donor} onChange={(e) => setDonor(e.target.value)} />
          <label className="block text-sm font-medium mt-3">Amount (INR)</label>
          <input type="number" className="mt-1 p-2 border rounded w-full" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={submit}>Donate (Demo)</button>
            <button className="px-4 py-2 border rounded" onClick={() => { setDonor(""); setAmount(500); }}>Reset</button>
          </div>
        </div>
      </section>
    );
  };

  const About = () => (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold">About Suramya – Maa Foundation</h2>
      <p className="mt-3 text-gray-700">Founded to bring quality education and digital skills to Varanasi, Suramya – Maa Foundation combines an NGO heart with sustainable earned-revenue activities: training, memberships, and community programs.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Mission</h4>
          <p className="text-sm text-gray-600 mt-2">Provide accessible skill-training and a safe study environment for students from all backgrounds.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Contact</h4>
          <p className="text-sm text-gray-600 mt-2">B28 4-4B, Ghasiyaritola, Durgakund, Varanasi<br/>Email: suramya@example.org<br/>Phone: +91 70000 00000</p>
        </div>
      </div>
    </section>
  );

  const Contact = () => {
    const [msg, setMsg] = useState("");
    const [name, setName] = useState("");
    return (
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Get in Touch</h2>
        <div className="mt-4 bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border rounded w-full" />
          <label className="block text-sm font-medium mt-3">Message</label>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="mt-1 p-2 border rounded w-full" rows={4} />
          <div className="mt-4 flex gap-2">
            <button onClick={() => { if (!name||!msg) return alert('Please enter name & message'); alert('Message sent (demo).'); setMsg(''); setName(''); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
            <button onClick={() => { setMsg(""); setName(""); }} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </div>
      </section>
    );
  };

  const Admin = () => {
    // simple demo admin: password = admin123
    return (
      <section className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Admin (Demo)</h2>
        {!isAdmin ? (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <label className="block text-sm font-medium">Admin Password</label>
            <input value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} className="mt-1 p-2 border rounded w-full" type="password" />
            <div className="mt-3 flex gap-2">
              <button onClick={() => { if (adminPwd === "admin123") { setIsAdmin(true); setAdminPwd(""); } else alert("Wrong demo password: try 'admin123'"); }} className="px-3 py-2 bg-indigo-600 text-white rounded">Login</button>
              <button onClick={() => { setAdminPwd(""); }} className="px-3 py-2 border rounded">Clear</button>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Admin Panel</h3>
              <div className="flex gap-2">
                <button onClick={() => { setIsAdmin(false); }} className="px-2 py-1 border rounded">Logout</button>
                <button onClick={clearData} className="px-2 py-1 border rounded">Clear Demo Data</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Bookings ({bookings.length})</h4>
              <div className="mt-2 max-h-48 overflow-auto border rounded">
                {bookings.length === 0 && <div className="p-2 text-sm text-gray-500">No bookings yet.</div>}
                {bookings.map((b) => (
                  <div key={b.id} className="p-2 border-b last:border-b-0">
                    <div className="text-sm">{b.type === 'course' ? `Course booking — ${courses.find(c=>c.id===b.courseId)?.title ?? 'unknown'}` : 'Study seat booking'}</div>
                    <div className="text-xs text-gray-600">By: {b.student?.name ?? '—'} · {new Date(b.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Courses</h4>
              <div className="mt-2 grid md:grid-cols-2 gap-2">
                {courses.map((c) => (
                  <div key={c.id} className="p-2 border rounded">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-gray-600">Fee: ₹{c.fee} · Seats: {c.seats}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <h5 className="font-medium">Add Course</h5>
                <AddCourseForm onAdd={(nc) => addCourse(nc)} />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Self-study Seats</h4>
              <div className="mt-2">Available seats: <b>{studySeats}</b></div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setStudySeats((s) => s + 5)} className="px-2 py-1 border rounded">+5</button>
                <button onClick={() => setStudySeats((s) => Math.max(0, s - 5))} className="px-2 py-1 border rounded">-5</button>
              </div>
            </div>

          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="py-6">
        {page === "home" && <Home />}
        {page === "programs" && <Programs />}
        {page === "book" && <Book />}
        {page === "donate" && <Donate />}
        {page === "about" && <About />}
        {page === "contact" && <Contact />}
        {page === "admin" && <Admin />}
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto p-4 text-sm text-gray-600 flex justify-between">
          <div>© Suramya – Maa Foundation</div>
          <div>Address: B28 4-4B, Ghasiyaritola, Durgakund, Varanasi</div>
        </div>
      </footer>
    </div>
  );
}

function AddCourseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [fee, setFee] = useState(1000);
  const [seats, setSeats] = useState(10);
  return (
    <div className="mt-2 grid grid-cols-1 gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" className="p-2 border rounded" />
      <input type="number" value={fee} onChange={(e) => setFee(Number(e.target.value))} className="p-2 border rounded" />
      <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="p-2 border rounded" />
      <div className="flex gap-2">
        <button onClick={() => { if(!title) return alert('Enter title'); onAdd({ title, fee, seats }); setTitle(''); setFee(1000); setSeats(10); }} className="px-3 py-1 border rounded">Add</button>
      </div>
    </div>
  );
}
