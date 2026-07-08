/* ============================================================
   APP LOGIC
   Reads the mock data from data.js and renders/wires up the UI.
   ============================================================ */

/* ---------- READ ROLE FROM LOGIN PAGE ---------- */
const urlParams = new URLSearchParams(window.location.search);
const selectedRole = urlParams.get('role') || "Administrator";

(function setUserChip(){
  const initials = selectedRole === "Doctor" ? "DR" : selectedRole === "Receptionist" ? "RC" : "AD";
  const name = selectedRole === "Doctor" ? "Dr. On Duty" : selectedRole === "Receptionist" ? "Front Desk" : "Admin User";
  document.getElementById('user-initials').textContent = initials;
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-role').textContent = selectedRole.toUpperCase();
  document.getElementById('greeting').textContent = "Good day, " +
    (selectedRole === "Doctor" ? "Doctor" : selectedRole === "Receptionist" ? "team" : "Admin") + ".";
})();

/* ---------- NAV ---------- */
document.querySelectorAll('.navlink').forEach(link=>{
  link.addEventListener('click', ()=>{
    document.querySelectorAll('.navlink').forEach(l=>l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.getElementById('sec-'+link.dataset.target).classList.add('active');
  });
});

/* ---------- CLOCK ---------- */
function tick(){
  const now = new Date();
  const t = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const d = now.toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('hero-time').textContent = t;
  document.getElementById('hero-date').textContent = d;
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
  renderPatients(patients.filter(p=>
    (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
    (!dept || p.dept === dept)
  ));
}
document.getElementById('patient-dept-filter').innerHTML += departments.map(d=>`<option value="${d}">${d}</option>`).join('');
renderPatients(patients);

/* ---------- DOCTORS ---------- */
document.getElementById('doctors-grid').innerHTML = doctors.map(d=>`
  <div class="doc-card">
    <div class="top">
      <div class="doc-avatar">${d.name.split(' ').map(w=>w[0]).slice(-2).join('')}</div>
      <div><h4>${d.name}</h4><div class="dept">${d.dept}</div></div>
    </div>
    <div class="doc-meta">
      <span>${d.patients} patients</span>
      <span class="avail-tag ${d.available?'on':'off'}">${d.available?'AVAILABLE':'IN SESSION'}</span>
    </div>
  </div>`).join('');

/* ---------- APPOINTMENTS ---------- */
document.getElementById('bk-doctor').innerHTML = doctors.map(d=>`<option>${d.name}</option>`).join('');
function renderAppts(){
  document.getElementById('appts-tbody').innerHTML = appointments.map(a=>`
    <tr>
      <td>${a.patient}</td><td>${a.doctor}</td><td class="mono">${a.date}</td><td class="mono">${a.time}</td>
      <td>${statusBadge(a.status)}</td>
      <td><div class="row-actions">
        <div class="icon-btn" title="Reschedule" onclick="showToast('Rescheduled for ${a.patient}')">&#8635;</div>
        <div class="icon-btn danger" title="Cancel" onclick="showToast('Cancelled for ${a.patient}')">&#10005;</div>
      </div></td>
    </tr>`).join('');
}
renderAppts();
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
document.getElementById('bills-tbody').innerHTML = bills.map(b=>`
  <tr>
    <td class="mono">${b.inv}</td><td>${b.patient}</td><td>${b.service}</td><td class="mono">${b.amount}</td>
    <td class="mono">${b.date}</td><td>${statusBadge(b.status)}</td>
    <td><div class="row-actions">
      <div class="icon-btn" title="Download invoice" onclick="showToast('Downloading ${b.inv}.pdf')">&#8681;</div>
    </div></td>
  </tr>`).join('');

/* ---------- DEPARTMENTS ---------- */
document.getElementById('dept-tbody').innerHTML = deptData.map(d=>`
  <tr><td>${d.name}</td><td>${d.head}</td><td class="mono">${d.doctors}</td><td class="mono">${d.patients}</td><td class="mono">${d.beds}</td></tr>
`).join('');

/* ---------- CHARTS ---------- */
function initCharts(){
  const teal = '#0E7C86', coral='#E1584A', amber='#C68A2E', slate='#5B7480', ink='#15304C';
  Chart.defaults.font.family = "'IBM Plex Mono', monospace";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = slate;

  new Chart(document.getElementById('chartGrowth'), {
    type:'line',
    data:{ labels:['Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{ label:'New patients', data:[142,158,171,163,189,204], borderColor:teal, backgroundColor:'rgba(14,124,134,0.08)', fill:true, tension:.35, pointRadius:3, pointBackgroundColor:teal }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });

  new Chart(document.getElementById('chartStatus'), {
    type:'doughnut',
    data:{ labels:['Completed','Confirmed','Pending','Cancelled'],
      datasets:[{ data:[18,10,6,3], backgroundColor:[teal,'#3FA3AC',amber,coral], borderWidth:2, borderColor:'#fff' }]},
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
      datasets:[{ label:'Revenue (\u20B9k)', data:[612,648,701,684,752,840], backgroundColor:teal, borderRadius:2 }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });

  new Chart(document.getElementById('chartAge'), {
    type:'bar',
    data:{ labels:['0-12','13-25','26-40','41-60','61-75','75+'],
      datasets:[{ label:'Patients', data:[112,148,286,340,231,97], backgroundColor:amber, borderRadius:2 }]},
    options:{ plugins:{legend:{display:false}}, scales:{ y:{grid:{color:'#EAEFEE'}}, x:{grid:{display:false}} } }
  });
}
initCharts();

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
    body.innerHTML = `
      <div class="field2" style="margin-bottom:12px;"><label>Full name</label><input id="m-p-name" placeholder="e.g. Sanjay Rao"></div>
      <div class="form-grid" style="margin-bottom:12px;">
        <div class="field2"><label>Age</label><input id="m-p-age" type="number" min="0" placeholder="e.g. 34"></div>
        <div class="field2"><label>Gender</label>
          <select id="m-p-gender"><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select>
        </div>
      </div>
      <div class="form-grid" style="margin-bottom:4px;">
        <div class="field2"><label>Department</label><select id="m-p-dept">${deptOptions()}</select></div>
        <div class="field2"><label>Assigned doctor</label><select id="m-p-doctor">${doctorOptions()}</select></div>
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
document.getElementById('modal-overlay').addEventListener('click', (e)=>{
  if(e.target.id === 'modal-overlay') closeModal();
});

function submitPatient(){
  const name = document.getElementById('m-p-name').value.trim();
  const age = document.getElementById('m-p-age').value;
  const gender = document.getElementById('m-p-gender').value;
  const dept = document.getElementById('m-p-dept').value;
  const doctor = document.getElementById('m-p-doctor').value;
  if(!name || !age){ showToast('Fill in name and age'); return; }

  patients.unshift({ id:"PT-"+(patientCounter++), name, age:Number(age), gender, dept, doctor, status:"Outpatient" });
  renderPatients(patients);
  closeModal();
  showToast(name + ' registered');
}

function submitDoctor(){
  const name = document.getElementById('m-d-name').value.trim();
  const dept = document.getElementById('m-d-dept').value;
  const available = document.getElementById('m-d-avail').value === 'true';
  if(!name){ showToast('Enter a doctor name'); return; }

  doctors.push({ name, dept, patients:0, available });
  document.getElementById('doctors-grid').innerHTML = doctors.map(d=>`
    <div class="doc-card">
      <div class="top">
        <div class="doc-avatar">${d.name.split(' ').map(w=>w[0]).slice(-2).join('')}</div>
        <div><h4>${d.name}</h4><div class="dept">${d.dept}</div></div>
      </div>
      <div class="doc-meta">
        <span>${d.patients} patients</span>
        <span class="avail-tag ${d.available?'on':'off'}">${d.available?'AVAILABLE':'IN SESSION'}</span>
      </div>
    </div>`).join('');
  document.getElementById('bk-doctor').innerHTML = doctors.map(d=>`<option>${d.name}</option>`).join('');
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
  document.getElementById('bills-tbody').innerHTML = bills.map(b=>`
    <tr>
      <td class="mono">${b.inv}</td><td>${b.patient}</td><td>${b.service}</td><td class="mono">${b.amount}</td>
      <td class="mono">${b.date}</td><td>${statusBadge(b.status)}</td>
      <td><div class="row-actions">
        <div class="icon-btn" title="Download invoice" onclick="showToast('Downloading ${b.inv}.pdf')">&#8681;</div>
      </div></td>
    </tr>`).join('');
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
  document.getElementById('dept-tbody').innerHTML = deptData.map(d=>`
    <tr><td>${d.name}</td><td>${d.head}</td><td class="mono">${d.doctors}</td><td class="mono">${d.patients}</td><td class="mono">${d.beds}</td></tr>
  `).join('');

  // Refresh every dropdown that lists departments
  document.getElementById('patient-dept-filter').innerHTML =
    '<option value="">All departments</option>' + departments.map(d=>`<option value="${d}">${d}</option>`).join('');

  closeModal();
  showToast(name + ' department added');
}

/* ---------- GLOBAL SEARCH ---------- */
document.getElementById('global-search').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    document.querySelector('[data-target="patients"]').click();
    document.getElementById('patient-search').value = e.target.value;
    filterPatients();
  }
});
