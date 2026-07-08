\# 🏥 Meridian — Hospital Management Dashboard System



A web-based dashboard that brings patient management, doctor scheduling, appointments, billing, and analytics into a single platform — built as a front-end prototype with HTML, CSS, JavaScript, and Chart.js.



\---



\## 📋 Overview



Hospitals often rely on separate manual systems or spreadsheets to manage patients, doctors, appointments, and billing. \*\*Meridian\*\* consolidates all of this into one clean, role-based dashboard — reducing friction for admins, doctors, and receptionists alike.



This is a \*\*UI-only prototype\*\*: all data is mock/in-memory (no backend or database yet), designed to validate the interface and user experience before backend development begins.



\---



\## ✨ Features



\### 🔐 Login \& Authentication

\- Role-based sign-in — \*\*Admin\*\*, \*\*Doctor\*\*, \*\*Receptionist\*\*

\- Session persists across pages (via `sessionStorage`)



\### 📊 Dashboard

\- Live stat cards — total patients, doctors, staff, today's appointments, revenue, emergency cases

\- 5 interactive charts (Chart.js) — patient growth, appointment status, department caseload, revenue trend, age distribution

\- Real-time clock and bed-availability panel



\### 🧑‍⚕️ Patients

\- Searchable, filterable patient registry

\- "Register Patient" form — adds live entries to the table



\### 👨‍⚕️ Doctors

\- Illustrated doctor profile cards with department and live availability

\- "Add Doctor" form



\### 📅 Appointments

\- Book, view, reschedule, or cancel appointments

\- Doctor availability shown alongside the booking form



\### 💳 Billing

\- Invoice table with payment status (Paid / Pending / Overdue)

\- "Generate Bill" form + invoice download action



\### 🏢 Departments

\- Department-wise staffing and caseload overview

\- "Add Department" form



\---



\## 🛠️ Tech Stack



| Layer | Technology |

|---|---|

| Structure | HTML5 |

| Styling | CSS3 (custom design system, no framework) |

| Interactivity | Vanilla JavaScript |

| Charts | \[Chart.js](https://www.chartjs.org/) |

| Fonts | IBM Plex Sans, IBM Plex Mono (Google Fonts) |



No build tools, no dependencies to install — it runs directly in the browser.



\---



\## 📁 Project Structure



```

hospital-dashboard/

├── index.html          # Login page

├── dashboard.html       # Dashboard: stats + charts

├── patients.html        # Patient registry

├── doctors.html         # Doctor profiles

├── appointments.html    # Appointment booking + schedule

├── billing.html         # Invoices + payment status

├── departments.html     # Department overview

├── css/

│   └── style.css        # Design tokens + all component styles

├── js/

│   ├── data.js           # Mock data (patients, doctors, appointments, bills, departments)

│   └── app.js            # Rendering, interactions, charts

└── assets/               # (reserved for future images/icons)

```



\---



\## 🚀 Getting Started



No installation required.



1\. Download / unzip the project folder.

2\. Open `index.html` in any modern browser (Chrome, Edge, Firefox).

3\. Sign in with \*\*any\*\* email and password — this is a demo login, so no real credentials are needed.

4\. Explore the dashboard using the sidebar navigation.



> 💡 Tip: For the best experience with multiple pages and forms, open the project with a local server (e.g. VS Code's "Live Server" extension) rather than the `file://` path — though double-clicking `index.html` also works fine.



\---



\## 🎨 Design Notes



\- \*\*Color system:\*\* a purple-to-blue gradient identity (`#6C5CE7` → `#4F7CFF`) applied to the login, sidebar, hero section, and primary actions — paired with IBM Plex Mono for all data readouts (stat numbers, IDs, timestamps) for a precise, clinical feel.

\- \*\*Doctor avatars:\*\* illustrated rather than stock photos, avoiding licensing/privacy concerns while keeping the interface visually rich.

\- \*\*Fully interactive:\*\* every "Add" button (Patient, Doctor, Bill, Department) opens a real form that updates the UI live — this isn't just a static mockup.



\---



\## 🗄️ Planned Database Schema (Next Phase)



| Table | Purpose |

|---|---|

| `Users` | Login credentials \& roles |

| `Patients` | Patient records |

| `Doctors` | Doctor profiles |

| `Departments` | Department metadata |

| `Appointments` | Booking records |

| `Bills` | Invoice records |

| `Payments` | Payment transactions |

| `Medical Records` | Patient medical history |



\---



\## 🔮 Future Scope



\- \[ ] MySQL database with the schema above

\- \[ ] Backend API (Spring Boot / Flask / Express)

\- \[ ] Real authentication (hashed passwords, JWT/session-based, role-based access control)

\- \[ ] Persistent data storage (currently resets on page refresh)

\- \[ ] PDF invoice generation

\- \[ ] Medical history / records module



\---



\## 📄 License



This project was built as an academic/demo project. Free to use, modify, and extend.



\---



\*Built with HTML, CSS, JavaScript, and Chart.js.\*



