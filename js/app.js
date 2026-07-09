/* ============================================================
   APP LOGIC
   Reads the mock data from data.js and renders/wires up the UI.
   ============================================================ */

/* ---------- ROLE & ACCESS CONTROL ---------- */
const urlParams = new URLSearchParams(window.location.search);
const selectedRole = sessionStorage.getItem('meridianRole');
const selectedName = sessionStorage.getItem('meridianName');

// Not logged in? Send back to the login page.
if(!selectedRole){
  window.location.href = "index.html";
}

// Which pages each role is allowed to see. The first entry is also
// where that role lands right after login and if it hits a blocked page.
const ROLE_ACCESS = {
  Administrator: ['dashboard','patients','doctors','appointments','billing','departments'],
  Doctor:        ['patients','appointments'],
  Receptionist:  ['appointments','billing'],
};
const allowedPages = ROLE_ACCESS[selectedRole] || [];

// Guard the current page: if this page isn't allowed for this role, bounce to their landing page.
const currentPage = window.location.pathname.split('/').pop().replace('.html','') || 'dashboard';
if(!allowedPages.includes(currentPage)){
  window.location.href = allowedPages[0] + ".html";
}

// Hide sidebar links this role isn't allowed to see.
document.querySelectorAll('.navlink').forEach(link=>{
  const key = link.getAttribute('href').replace('.html','');
  if(!allowedPages.includes(key)){ link.style.display = 'none'; }
});

// For a Doctor account, this is the doctor record their data gets filtered to.
const loggedDoctorName = selectedRole === 'Doctor' ? selectedName : null;

(function setUserChip(){
  const initials = selectedRole === "Doctor" ? "DR" : selectedRole === "Receptionist" ? "RC" : "AD";
  document.getElementById('user-initials').textContent = initials;
  document.getElementById('user-name').textContent = selectedName || 'User';
  document.getElementById('user-role').textContent = selectedRole.toUpperCase();
  const greeting = document.getElementById('greeting');
  if(greeting){
    greeting.textContent = "Good day, " +
      (selectedRole === "Doctor" ? selectedName : selectedRole === "Receptionist" ? "team" : "Admin") + ".";
  }
})();

/* ---------- NAV ----------
   Each sidebar item is now a real <a href="..."> pointing at its own page,
   with the "active" class set directly in the HTML of each page. No JS needed here. */

/* ---------- CLOCK ---------- */
function tick(){
  const now = new Date();
  const t = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const d = now.toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const heroTime = document.getElementById('hero-time');
  const heroDate = document.getElementById('hero-date');
  if(heroTime) heroTime.textContent = t;
  if(heroDate) heroDate.textContent = d;
  document.getElementById('side-clock').textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}
tick();
setInterval(tick, 1000);

/* ---------- TOAST ---------- */
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------- SHARED: STATUS BADGE ---------- */
function statusBadge(status){
  const map = {Admitted:"amber", Discharged:"green", Outpatient:"green", Critical:"red",
    Confirmed:"green", Pending:"amber", Cancelled:"red", Paid:"green", Overdue:"red"};
  return `<span class="badge ${map[status]||'amber'}">${status}</span>`;
}

/* ---------- PATIENTS ---------- */
// Returns the patient list this logged-in user is allowed to see.
function visiblePatients(){
  return loggedDoctorName ? patients.filter(p=>p.doctor === loggedDoctorName) : patients;
}

function renderPatients(list){
  document.getElementById('patients-tbody').innerHTML = list.map(p=>`
    <tr>
      <td class="mono">${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age} / ${p.gender}</td>
      <td>${p.dept}</td>
      <td>${p.doctor}</td>
      <td>${statusBadge(p.status)}</td>
      <td><div class="row-actions">
        <div class="icon-btn" title="Edit" onclick="showToast('Editing ${p.name}')">&#9998;</div>
        <div class="icon-btn danger" title="Delete" onclick="showToast('${p.name} removed')">&#10005;</div>
      </div></td>
    </tr>`).join('');
}
function filterPatients(){
  const q = document.getElementById('patient-search').value.toLowerCase();
  const dept = document.getElementById('patient-dept-filter').value;
  renderPatients(visiblePatients().filter(p=>
    (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
    (!dept || p.dept === dept)
  ));
}
(function initPatientsPage(){
  const filterEl = document.getElementById('patient-dept-filter');
  if(!filterEl) return; // not on the patients page
  filterEl.innerHTML += departments.map(d=>`<option value="${d}">${d}</option>`).join('');
  renderPatients(visiblePatients());

  // If we arrived here via a global search redirect, prefill and filter.
  const searchParam = urlParams.get('q');
  if(searchParam){
    document.getElementById('patient-search').value = searchParam;
    filterPatients();
  }
})();

/* ---------- DOCTORS ---------- */
const avatarPalette = ['#6C5CE7','#4F7CFF','#FF8FB1','#4FD1C5','#F0A93C','#8C7AE6','#5AC8FA','#FF6B6B'];

function doctorAvatarSVG(index){
  const ring = avatarPalette[index % avatarPalette.length];
  const hairStyle = index % 2 === 0
    ? '<path d="M20 30c0-11 8-18 18-18s18 7 18 18" fill="#2B2340"/>'   // rounded hair
    : '<path d="M18 28c2-13 10-20 20-20s18 7 20 20c-3-2-8-4-20-4s-17 2-20 4z" fill="#3A2E17"/>'; // side-parted hair
  return `
    <svg viewBox="0 0 76 76" width="100%" height="100%">
      <circle cx="38" cy="38" r="37" fill="none" stroke="${ring}" stroke-width="2.5"/>
      <circle cx="38" cy="38" r="33" fill="#EEF0FB"/>
      <!-- coat / shoulders -->
      <path d="M12 66c2-14 12-20 26-20s24 6 26 20z" fill="#FFFFFF" stroke="#D7DBEC" stroke-width="1"/>
      <path d="M30 46l8 8 8-8" fill="none" stroke="${ring}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- stethoscope -->
      <path d="M28 50c0 6 4 9 10 9s10-3 10-9" fill="none" stroke="${ring}" stroke-width="2" stroke-linecap="round"/>
      <!-- neck -->
      <rect x="33" y="38" width="10" height="10" rx="4" fill="#E7B98F"/>
      <!-- head -->
      <circle cx="38" cy="28" r="13" fill="#F1C6A0"/>
      ${hairStyle}
    </svg>`;
}

function renderDoctorsGrid(){
  document.getElementById('doctors-grid').innerHTML = doctors.map((d,i)=>`
    <div class="doc-card">
      <div class="doc-photo">${doctorAvatarSVG(i)}</div>
      <h4>${d.name}</h4>
      <div class="dept">${d.dept}</div>
      <div class="doc-meta">
        <span>${d.patients} patients</span>
        <span class="avail-tag ${d.available?'on':'off'}">${d.available?'AVAILABLE':'IN SESSION'}</span>
      </div>
      <button class="btn ghost doc-profile-btn" onclick="showToast('Viewing profile: ${d.name}')">View Profile</button>
    </div>`).join('');
}
if(document.getElementById('doctors-grid')){ renderDoctorsGrid(); }

/* ---------- APPOINTMENTS ---------- */
function visibleAppointments(){
  return loggedDoctorName ? appointments.filter(a=>a.doctor === loggedDoctorName) : appointments;
}
function renderAppts(){
  document.getElementById('appts-tbody').innerHTML = visibleAppointments().map(a=>`
    <tr>
      <td>${a.patient}</td><td>${a.doctor}</td><td class="mono">${a.date}</td><td class="mono">${a.time}</td>
      <td>${statusBadge(a.status)}</td>
      <td><div class="row-actions">
        <div class="icon-btn" title="Reschedule" onclick="showToast('Rescheduled for ${a.patient}')">&#8635;</div>
        <div class="icon-btn danger" title="Cancel" onclick="showToast('Cancelled for ${a.patient}')">&#10005;</div>
      </div></td>
    </tr>`).join('');
}
if(document.getElementById('bk-doctor')){
  if(loggedDoctorName){
    // Doctors can only book under their own name.
    document.getElementById('bk-doctor').innerHTML = `<option>${loggedDoctorName}</option>`;
    document.getElementById('bk-doctor').disabled = true;
  } else {
    document.getElementById('bk-doctor').innerHTML = doctors.map(d=>`<option>${d.name}</option>`).join('');
  }
}
if(document.getElementById('appts-tbody')){ renderAppts(); }
function bookAppointment(){
  const patient = document.getElementById('bk-patient').value.trim();
  const doctor = document.getElementById('bk-doctor').value;
  const date = document.getElementById('bk-date').value;
  const time = document.getElementById('bk-time').value;
  if(!patient || !date || !time){ showToast('Fill in all fields to book'); return; }
  appointments.unshift({patient, doctor, date, time, status:"Pending"});
  renderAppts();
  document.getElementById('bk-patient').value='';
  showToast('Appointment booked for '+patient);
}

/* ---------- BILLING ---------- */
function renderBills(){
  document.getElementById('bills-tbody').innerHTML = bills.map(b=>`
    <tr>
      <td class="mono">${b.inv}</td><td>${b.patient}</td><td>${b.service}</td><td class="mono">${b.amount}</td>
      <td class="mono">${b.date}</td><td>${statusBadge(b.status)}</td>
      <td><div class="row-actions">
        <div class="icon-btn" title="Download invoice" onclick="showToast('Downloading ${b.inv}.pdf')">&#8681;</div>
      </div></td>
    </tr>`).join('');
}
if(document.getElementById('bills-tbody')){ renderBills(); }

/* ---------- DEPARTMENTS ---------- */
function renderDeptTable(){
  document.getElementById('dept-tbody').innerHTML = deptData.map(d=>`
    <tr><td>${d.name}</td><td>${d.head}</td><td class="mono">${d.doctors}</td><td class="mono">${d.patients}</td><td class="mono">${d.beds}</td></tr>
  `).join('');
}
if(document.getElementById('dept-tbody')){ renderDeptTable(); }

/* ---------- CHARTS ---------- */
function initCharts(){
  const primary = '#6C5CE7', blue='#4F7CFF', coral='#FF6B6B', amber='#F0A93C', slate='#6B7290', ink='#241E4E';
  Chart.defaults.font.family = "'IBM Plex Mono', monospace";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = slate;

  new Chart(document.getElementById('chartGrowth'), {
    type:'line',
    data:{ labels:['Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{ label:'New patients', data:[142,158,171,163,189,204], borderColor:primary, backgroundColor:'rgba(108,92,231,0.10)', fill:true, tension:.35, pointRadius:3, pointBackgroundColor:primary }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });

  new Chart(document.getElementById('chartStatus'), {
    type:'doughnut',
    data:{ labels:['Completed','Confirmed','Pending','Cancelled'],
      datasets:[{ data:[18,10,6,3], backgroundColor:[primary,blue,amber,coral], borderWidth:2, borderColor:'#fff' }]},
    options:{ plugins:{legend:{position:'bottom', labels:{boxWidth:9, padding:14}}}, cutout:'62%' }
  });

  new Chart(document.getElementById('chartDept'), {
    type:'bar',
    data:{ labels:['Cardio','Neuro','Ortho','Peds','Gen Med','Derm','ENT','ER'],
      datasets:[{ label:'Patients', data:[46,38,55,72,89,26,33,21], backgroundColor:ink, borderRadius:2 }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });

  new Chart(document.getElementById('chartRevenue'), {
    type:'bar',
    data:{ labels:['Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{ label:'Revenue (\u20B9k)', data:[612,648,701,684,752,840], backgroundColor:blue, borderRadius:2 }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });

  new Chart(document.getElementById('chartAge'), {
    type:'bar',
    data:{ labels:['0-12','13-25','26-40','41-60','61-75','75+'],
      datasets:[{ label:'Patients', data:[112,148,286,340,231,97], backgroundColor:amber, borderRadius:2 }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });
}
if(document.getElementById('chartGrowth')){ initCharts(); }

/* ---------- MODAL: ADD PATIENT / ADD DOCTOR / GENERATE BILL ---------- */
let patientCounter = 1052;
let invoiceCounter = 3307;

function deptOptions(selected){
  return departments.map(d=>`<option ${d===selected?'selected':''}>${d}</option>`).join('');
}
function doctorOptions(){
  return doctors.map(d=>`<option>${d.name}</option>`).join('');
}

function openModal(type){
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  if(type === 'patient'){
    title.textContent = 'Register Patient';
    const doctorField = loggedDoctorName
      ? `<select id="m-p-doctor" disabled><option>${loggedDoctorName}</option></select>`
      : `<select id="m-p-doctor">${doctorOptions()}</select>`;
    const myDept = loggedDoctorName ? (doctors.find(d=>d.name===loggedDoctorName)?.dept) : null;
    body.innerHTML = `
      <div class="field2" style="margin-bottom:12px;"><label>Full name</label><input id="m-p-name" placeholder="e.g. Sanjay Rao"></div>
      <div class="form-grid" style="margin-bottom:12px;">
        <div class="field2"><label>Age</label><input id="m-p-age" type="number" min="0" placeholder="e.g. 34"></div>
        <div class="field2"><label>Gender</label>
          <select id="m-p-gender"><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select>
        </div>
      </div>
      <div class="form-grid" style="margin-bottom:4px;">
        <div class="field2"><label>Department</label><select id="m-p-dept">${deptOptions(myDept)}</select></div>
        <div class="field2"><label>Assigned doctor</label>${doctorField}</div>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" onclick="closeModal()">Cancel</button>
        <button class="btn" onclick="submitPatient()">Register</button>
      </div>`;
  }

  if(type === 'doctor'){
    title.textContent = 'Add Doctor';
    body.innerHTML = `
      <div class="field2" style="margin-bottom:12px;"><label>Doctor name</label><input id="m-d-name" placeholder="e.g. Dr. Kavita Bose"></div>
      <div class="form-grid" style="margin-bottom:4px;">
        <div class="field2"><label>Department</label><select id="m-d-dept">${deptOptions()}</select></div>
        <div class="field2"><label>Availability</label>
          <select id="m-d-avail"><option value="true">Available</option><option value="false">In session</option></select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" onclick="closeModal()">Cancel</button>
        <button class="btn" onclick="submitDoctor()">Add Doctor</button>
      </div>`;
  }

  if(type === 'department'){
    title.textContent = 'Add Department';
    body.innerHTML = `
      <div class="field2" style="margin-bottom:12px;"><label>Department name</label><input id="m-dp-name" placeholder="e.g. Oncology"></div>
      <div class="field2" style="margin-bottom:12px;"><label>Head doctor</label><input id="m-dp-head" placeholder="e.g. Dr. Alok Sinha"></div>
      <div class="form-grid" style="margin-bottom:4px;">
        <div class="field2"><label>Beds allocated</label><input id="m-dp-beds" type="number" min="0" placeholder="e.g. 15"></div>
        <div class="field2"><label>Active patients</label><input id="m-dp-patients" type="number" min="0" placeholder="e.g. 0"></div>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" onclick="closeModal()">Cancel</button>
        <button class="btn" onclick="submitDepartment()">Add Department</button>
      </div>`;
  }

  if(type === 'bill'){
    title.textContent = 'Generate Bill';
    body.innerHTML = `
      <div class="field2" style="margin-bottom:12px;"><label>Patient name</label><input id="m-b-patient" placeholder="e.g. Ravi Kumar"></div>
      <div class="field2" style="margin-bottom:12px;"><label>Service / reason</label><input id="m-b-service" placeholder="e.g. Cardiac consult"></div>
      <div class="form-grid" style="margin-bottom:4px;">
        <div class="field2"><label>Amount (&#8377;)</label><input id="m-b-amount" type="number" min="0" placeholder="e.g. 2400"></div>
        <div class="field2"><label>Status</label>
          <select id="m-b-status"><option>Pending</option><option>Paid</option><option>Overdue</option></select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" onclick="closeModal()">Cancel</button>
        <button class="btn" onclick="submitBill()">Generate</button>
      </div>`;
  }

  overlay.classList.add('show');
}

function closeModal(){
  document.getElementById('modal-overlay').classList.remove('show');
}
// Click outside the card to close
const modalOverlayEl = document.getElementById('modal-overlay');
if(modalOverlayEl){
  modalOverlayEl.addEventListener('click', (e)=>{
    if(e.target.id === 'modal-overlay') closeModal();
  });
}

function submitPatient(){
  const name = document.getElementById('m-p-name').value.trim();
  const age = document.getElementById('m-p-age').value;
  const gender = document.getElementById('m-p-gender').value;
  const dept = document.getElementById('m-p-dept').value;
  const doctor = document.getElementById('m-p-doctor').value;
  if(!name || !age){ showToast('Fill in name and age'); return; }

  patients.unshift({ id:"PT-"+(patientCounter++), name, age:Number(age), gender, dept, doctor, status:"Outpatient" });
  renderPatients(visiblePatients());
  closeModal();
  showToast(name + ' registered');
}

function submitDoctor(){
  const name = document.getElementById('m-d-name').value.trim();
  const dept = document.getElementById('m-d-dept').value;
  const available = document.getElementById('m-d-avail').value === 'true';
  if(!name){ showToast('Enter a doctor name'); return; }

  doctors.push({ name, dept, patients:0, available });
  renderDoctorsGrid();
  const bkDoctor = document.getElementById('bk-doctor');
  if(bkDoctor){ bkDoctor.innerHTML = doctors.map(d=>`<option>${d.name}</option>`).join(''); }
  closeModal();
  showToast(name + ' added to ' + dept);
}

function submitBill(){
  const patient = document.getElementById('m-b-patient').value.trim();
  const service = document.getElementById('m-b-service').value.trim();
  const amount = document.getElementById('m-b-amount').value;
  const status = document.getElementById('m-b-status').value;
  if(!patient || !service || !amount){ showToast('Fill in all billing fields'); return; }

  const today = new Date().toISOString().slice(0,10);
  bills.unshift({ inv:"INV-"+(invoiceCounter++), patient, service, amount:"\u20B9"+Number(amount).toLocaleString('en-IN'), date:today, status });
  renderBills();
  closeModal();
  showToast('Invoice ' + (invoiceCounter-1) + ' generated');
}

function submitDepartment(){
  const name = document.getElementById('m-dp-name').value.trim();
  const head = document.getElementById('m-dp-head').value.trim() || '\u2014';
  const beds = Number(document.getElementById('m-dp-beds').value) || 0;
  const patientCount = Number(document.getElementById('m-dp-patients').value) || 0;
  if(!name){ showToast('Enter a department name'); return; }
  if(departments.includes(name)){ showToast(name + ' already exists'); return; }

  departments.push(name);
  deptData.push({ name, head, doctors: 0, patients: patientCount, beds });

  // Refresh the departments table
  renderDeptTable();

  // Refresh every dropdown that lists departments (only present on the Patients page)
  const filterEl = document.getElementById('patient-dept-filter');
  if(filterEl){
    filterEl.innerHTML = '<option value="">All departments</option>' + departments.map(d=>`<option value="${d}">${d}</option>`).join('');
  }

  closeModal();
  showToast(name + ' department added');
}

/* ---------- GLOBAL SEARCH ----------
   On the Patients page it filters directly; anywhere else, Enter navigates
   to patients.html carrying the search term as a URL param. */
document.getElementById('global-search').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    const value = e.target.value.trim();
    if(document.getElementById('patient-search')){
      document.getElementById('patient-search').value = value;
      filterPatients();
    } else {
      window.location.href = 'patients.html' + (value ? '?q=' + encodeURIComponent(value) : '');
    }
  }
});
