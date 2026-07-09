/* ============================================================
   MOCK DATA
   Stand-ins for what would normally come from a database.
   Replace these arrays with real API calls if you add a backend later.
   ============================================================ */

const departments = ["Cardiology","Neurology","Orthopedics","Pediatrics","General Medicine","Dermatology","ENT","Emergency"];

const doctors = [
  {name:"Dr. Anita Rao", dept:"Cardiology", patients:34, available:true},
  {name:"Dr. Vikram Shah", dept:"Neurology", patients:28, available:true},
  {name:"Dr. Meera Iyer", dept:"Orthopedics", patients:41, available:false},
  {name:"Dr. Sameer Khan", dept:"Pediatrics", patients:52, available:true},
  {name:"Dr. Priya Nair", dept:"General Medicine", patients:63, available:true},
  {name:"Dr. Arjun Verma", dept:"Dermatology", patients:19, available:true},
  {name:"Dr. Leela Menon", dept:"ENT", patients:22, available:false},
  {name:"Dr. Rohan Das", dept:"Emergency", patients:15, available:true},
];

const patients = [
  {id:"PT-1042", name:"Ravi Kumar", age:34, gender:"M", dept:"Cardiology", doctor:"Dr. Anita Rao", status:"Admitted"},
  {id:"PT-1043", name:"Sunita Sharma", age:58, gender:"F", dept:"Orthopedics", doctor:"Dr. Meera Iyer", status:"Discharged"},
  {id:"PT-1044", name:"Aarav Patel", age:9, gender:"M", dept:"Pediatrics", doctor:"Dr. Sameer Khan", status:"Outpatient"},
  {id:"PT-1045", name:"Neha Gupta", age:27, gender:"F", dept:"Dermatology", doctor:"Dr. Arjun Verma", status:"Outpatient"},
  {id:"PT-1046", name:"Karan Mehta", age:45, gender:"M", dept:"Neurology", doctor:"Dr. Vikram Shah", status:"Admitted"},
  {id:"PT-1047", name:"Divya Reddy", age:63, gender:"F", dept:"General Medicine", doctor:"Dr. Priya Nair", status:"Admitted"},
  {id:"PT-1048", name:"Farhan Ali", age:5, gender:"M", dept:"Emergency", doctor:"Dr. Rohan Das", status:"Critical"},
  {id:"PT-1049", name:"Ishita Sen", age:71, gender:"F", dept:"ENT", doctor:"Dr. Leela Menon", status:"Discharged"},
  {id:"PT-1050", name:"Manoj Tiwari", age:39, gender:"M", dept:"Cardiology", doctor:"Dr. Anita Rao", status:"Outpatient"},
  {id:"PT-1051", name:"Priya Das", age:16, gender:"F", dept:"Pediatrics", doctor:"Dr. Sameer Khan", status:"Outpatient"},
];

const appointments = [
  {patient:"Ravi Kumar", doctor:"Dr. Anita Rao", date:"2026-07-07", time:"10:30", status:"Confirmed"},
  {patient:"Neha Gupta", doctor:"Dr. Arjun Verma", date:"2026-07-07", time:"11:15", status:"Confirmed"},
  {patient:"Karan Mehta", doctor:"Dr. Vikram Shah", date:"2026-07-07", time:"12:00", status:"Pending"},
  {patient:"Divya Reddy", doctor:"Dr. Priya Nair", date:"2026-07-08", time:"09:45", status:"Confirmed"},
  {patient:"Ishita Sen", doctor:"Dr. Leela Menon", date:"2026-07-08", time:"14:20", status:"Cancelled"},
  {patient:"Manoj Tiwari", doctor:"Dr. Anita Rao", date:"2026-07-09", time:"16:00", status:"Confirmed"},
];

const bills = [
  {inv:"INV-3301", patient:"Ravi Kumar", service:"Cardiac consult", amount:"\u20B92,400", date:"2026-07-05", status:"Paid"},
  {inv:"INV-3302", patient:"Sunita Sharma", service:"Ortho surgery", amount:"\u20B958,000", date:"2026-07-03", status:"Pending"},
  {inv:"INV-3303", patient:"Aarav Patel", service:"Pediatric checkup", amount:"\u20B9900", date:"2026-07-06", status:"Paid"},
  {inv:"INV-3304", patient:"Karan Mehta", service:"MRI scan", amount:"\u20B96,200", date:"2026-07-04", status:"Overdue"},
  {inv:"INV-3305", patient:"Divya Reddy", service:"Ward admission (3d)", amount:"\u20B921,500", date:"2026-07-02", status:"Paid"},
  {inv:"INV-3306", patient:"Farhan Ali", service:"Emergency care", amount:"\u20B94,800", date:"2026-07-07", status:"Pending"},
];

const deptData = departments.map((d,i)=>({
  name:d,
  head: doctors.find(x=>x.dept===d)?.name || "\u2014",
  doctors: doctors.filter(x=>x.dept===d).length,
  patients: patients.filter(x=>x.dept===d).length + [12,9,15,20,26,7,11,6][i],
  beds: [30,18,20,20,25,10,12,12][i],
}));
