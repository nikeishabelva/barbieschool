const state={students:[],teachers:[],classes:[],subjects:[],schedule:[],announcements:[]};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
async function loadData(){
  const names=["students","teachers","classes","subjects","schedule","announcements"];
  await Promise.all(names.map(async n=>{try{state[n]=await (await fetch(`data/${n}.json`)).json()}catch(e){state[n]=[]}}));
}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>el.classList.remove("show"),2200)}
function statCard(icon,label,value,trend){return `<div class="stat-card"><div><small>${label}</small><h3>${value}</h3><span class="trend">${trend}</span></div><div class="stat-icon">${icon}</div></div>`}
function pageHead(eyebrow,title,sub,button=""){return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-sub">${sub}</p></div>${button?`<button class="primary-btn" onclick="toast('${button.replace(/'/g,"\\'")} clicked')">＋ ${button}</button>`:""}</div>`}
function renderDashboard(){
 const d=new Date(); const date=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
 return `${pageHead("BARBIE SCHOOL","Good Morning, Belva! ✦","Welcome back to your school management dashboard.","Add Student")}
 <div class="hero"><div><div class="eyebrow">TODAY'S OVERVIEW</div><h1>Make today beautiful.</h1><p>Manage classes, students, schedules and school activities in one place.</p></div><div class="hero-date"><strong>${date}</strong><span>Barbie School • Academic Year 2026/2027</span></div></div>
 <div class="stats">${statCard("♙","Total Students","1,248","+8.4% this month")}${statCard("♧","Teachers","86","+3 new teachers")}${statCard("▦","Classes","32","All classes active")}${statCard("✓","Attendance","94%","+2.1% this week")}</div>
 <div class="grid-2">
  <div class="panel"><div class="panel-head"><h3>Today's Schedule</h3><span>Monday</span></div>${state.schedule.map(x=>`<div class="schedule-row"><div class="time">${x.time}</div><div><div class="subject">${esc(x.subject)}</div><div class="teacher">${esc(x.teacher)}</div></div><div class="room">${esc(x.room)}</div></div>`).join("")}</div>
  <div class="panel"><div class="panel-head"><h3>Announcements</h3><span>View all</span></div>${state.announcements.map(x=>`<div class="announcement"><span class="badge pink">${esc(x.type)}</span><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p></div>`).join("")}</div>
 </div>
 <div class="grid-2" style="margin-top:18px">
  <div class="panel"><div class="panel-head"><h3>Attendance Overview</h3><span>This week</span></div><div class="chart">${[78,84,90,86,94,91,96].map((v,i)=>`<div class="bar-col"><b>${v}%</b><div class="bar" style="height:${v*1.55}px"></div><small>${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</small></div>`).join("")}</div></div>
  <div class="panel"><div class="panel-head"><h3>Quick Stats</h3><span>September</span></div><div class="info-card" style="margin-bottom:10px"><span class="big">87%</span><h4>Assignment completion</h4><div class="progress"><span style="width:87%"></span></div></div><div class="info-card"><span class="big">76%</span><h4>Average class performance</h4><div class="progress"><span style="width:76%"></span></div></div></div>
 </div>`;
}
function renderStudents(){
 return `${pageHead("ACADEMIC","Students","Manage student profiles, classes and attendance.","Add Student")}
 <div class="table-toolbar"><input class="input" id="tableSearch" placeholder="Search students..."><select class="select" id="classFilter"><option value="">All classes</option>${[...new Set(state.students.map(s=>s.class))].map(c=>`<option>${c}</option>`).join("")}</select></div>
 <div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>ID</th><th>Class</th><th>Attendance</th><th>Status</th><th></th></tr></thead><tbody id="studentRows">${studentRows(state.students)}</tbody></table></div>`;
}
function studentRows(arr){return arr.map(s=>`<tr><td><div class="person"><div class="person-avatar">${initials(s.name)}</div><div><strong>${esc(s.name)}</strong><span>${esc(s.gender)}</span></div></div></td><td>${s.id}</td><td><span class="badge pink">${s.class}</span></td><td>${s.attendance}</td><td><span class="badge green">${s.status}</span></td><td><button class="action-btn" onclick="toast('Opening ${esc(s.name)}')">View</button></td></tr>`).join("")}
function renderTeachers(){
 return `${pageHead("PEOPLE","Teachers","Faculty directory and teaching assignments.","Add Teacher")}
 <div class="table-wrap"><table class="data-table"><thead><tr><th>Teacher</th><th>ID</th><th>Subject</th><th>Classes</th><th></th></tr></thead><tbody>${state.teachers.map(t=>`<tr><td><div class="person"><div class="person-avatar">${initials(t.name)}</div><div><strong>${esc(t.name)}</strong><span>Faculty member</span></div></div></td><td>${t.id}</td><td>${esc(t.subject)}</td><td>${esc(t.classes)}</td><td><button class="action-btn" onclick="toast('Teacher profile opened')">View</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderClasses(){
 return `${pageHead("ACADEMIC","Classes","Overview of homerooms, student counts and levels.","Add Class")}<div class="cards-grid">${state.classes.map(c=>`<div class="info-card"><span class="badge pink">${esc(c.level)}</span><h4>Class ${esc(c.name)}</h4><p>Homeroom: ${esc(c.homeroom)}</p><div style="margin-top:14px"><span class="big">${c.students}</span><span style="font-size:10px;color:var(--muted)"> students</span></div><div class="progress"><span style="width:${Math.min(100,c.students*2.7)}%"></span></div></div>`).join("")}</div>`;
}
function renderSubjects(){
 return `${pageHead("ACADEMIC","Subjects","Curriculum and teachers responsible for each subject.","Add Subject")}<div class="cards-grid">${state.subjects.map(s=>`<div class="info-card"><span class="badge ${s.color}">${s.code}</span><h4>${esc(s.name)}</h4><p>Teacher: ${esc(s.teacher)}</p><button class="secondary-btn" style="margin-top:15px" onclick="toast('${esc(s.name)} selected')">View subject</button></div>`).join("")}</div>`;
}
function renderSchedule(){
 return `${pageHead("ACADEMIC","Schedule","Today's class timetable and room assignments.","Add Schedule")}<div class="panel">${state.schedule.map(x=>`<div class="schedule-row"><div class="time">${x.time}</div><div><div class="subject">${esc(x.subject)}</div><div class="teacher">${esc(x.teacher)}</div></div><div class="room">${esc(x.room)}</div></div>`).join("")}</div>`;
}
function renderAssignments(){
 const items=[["Mathematics Project","8A","Sept 5, 2026","High"],["Biology Lab Report","8B","Sept 7, 2026","Medium"],["English Presentation","7A","Sept 9, 2026","Low"],["Art Poster","9A","Sept 11, 2026","Medium"]];
 return `${pageHead("ACADEMIC","Assignments","Track homework, deadlines and priorities.","Create Assignment")}<div class="table-wrap"><table class="data-table"><thead><tr><th>Assignment</th><th>Class</th><th>Deadline</th><th>Priority</th><th>Status</th></tr></thead><tbody>${items.map(x=>`<tr><td><strong>${x[0]}</strong></td><td>${x[1]}</td><td>${x[2]}</td><td><span class="badge ${x[3]==="High"?"red":x[3]==="Medium"?"yellow":"green"}">${x[3]}</span></td><td><span class="badge pink">In progress</span></td></tr>`).join("")}</tbody></table></div>`;
}
function renderGrades(){
 return `${pageHead("ACADEMIC","Grades","Class performance and subject averages.","Enter Grades")}<div class="stats">${statCard("★","Average Score","87.6","+4.2% vs last term")}${statCard("A","Grade A","312","25% of students")}${statCard("B","Grade B","641","51% of students")}${statCard("C","Needs Support","295","24% of students")}</div><div class="panel"><div class="panel-head"><h3>Subject Performance</h3><span>Average score</span></div><div class="chart">${[88,84,92,79,90,86].map((v,i)=>`<div class="bar-col"><b>${v}</b><div class="bar" style="height:${v*1.55}px"></div><small>${["Math","Bio","Eng","History","Art","CS"][i]}</small></div>`).join("")}</div></div>`;
}
function renderAttendance(){
 return `${pageHead("STUDENT LIFE","Attendance","Daily attendance monitoring and class presence.","Record Attendance")}<div class="stats">${statCard("✓","Present","1,174","94.1%")}${statCard("I","Excused","38","3.0%")}${statCard("S","Sick","25","2.0%")}${statCard("A","Absent","11","0.9%")}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Class</th><th>Today</th><th>Monthly</th></tr></thead><tbody>${state.students.map(s=>`<tr><td><div class="person"><div class="person-avatar">${initials(s.name)}</div><strong>${esc(s.name)}</strong></div></td><td>${s.class}</td><td><span class="badge green">Present</span></td><td>${s.attendance}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderAnnouncements(){
 return `${pageHead("SCHOOL","Announcements","Latest school news, events and notices.","New Announcement")}<div class="cards-grid">${state.announcements.map(a=>`<div class="info-card"><span class="badge pink">${esc(a.type)}</span><h4>${esc(a.title)}</h4><p>${esc(a.text)}</p><p style="margin-top:10px"><b>${esc(a.date)}</b></p></div>`).join("")}</div>`;
}
function renderCalendar(){
 const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]; const cells=[];
 for(let i=0;i<35;i++){let n=i-1;let muted=n<1||n>30;let num=muted?(n<1?30+i:n-30):n;cells.push(`<div class="cal-day ${muted?"muted":""} ${num===1&&!muted?"today":""} ${[5,15,21,28].includes(num)&&!muted?"event":""}">${num}</div>`)}
 return `${pageHead("SCHOOL","Calendar","September 2026 • Academic calendar")}<div class="panel"><div class="calendar">${days.map(d=>`<div class="cal-head">${d}</div>`).join("")}${cells.join("")}</div></div>`;
}
function renderSettings(){
 return `${pageHead("SYSTEM","Settings","Customize your Barbie School experience.")}<div class="panel"><div class="form-grid"><div class="field"><label>School name</label><input value="Barbie School"></div><div class="field"><label>Academic year</label><input value="2026 / 2027"></div><div class="field"><label>Administrator name</label><input value="Belva"></div><div class="field"><label>Default class</label><select><option>8A</option><option>8B</option><option>9A</option></select></div><div class="field full"><label>School description</label><textarea>Modern, creative and student-centered school management dashboard.</textarea></div></div><button class="primary-btn" style="margin-top:15px" onclick="toast('Settings saved successfully')">Save Changes</button></div>`;
}
const pages={dashboard:renderDashboard,students:renderStudents,teachers:renderTeachers,classes:renderClasses,subjects:renderSubjects,schedule:renderSchedule,assignments:renderAssignments,grades:renderGrades,attendance:renderAttendance,announcements:renderAnnouncements,calendar:renderCalendar,settings:renderSettings};
function renderPage(){
 let p=location.hash.slice(1)||"dashboard"; if(!pages[p])p="dashboard";
 document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===p));
 $("#appContent").innerHTML=pages[p]();
 document.title=`Barbie School | ${p[0].toUpperCase()+p.slice(1)}`;
 if(p==="students"){
  const s=$("#tableSearch"),f=$("#classFilter");
  const update=()=>{const q=s.value.toLowerCase(),c=f.value;$("#studentRows").innerHTML=studentRows(state.students.filter(x=>(x.name+" "+x.id).toLowerCase().includes(q)&&(!c||x.class===c)))};
  s.addEventListener("input",update);f.addEventListener("change",update);
 }
}
function setup(){
 window.addEventListener("hashchange",renderPage);
 $("#menuBtn").onclick=()=>{$("#sidebar").classList.add("open");$("#sidebarOverlay").classList.add("show")};
 $("#sidebarOverlay").onclick=()=>{$("#sidebar").classList.remove("open");$("#sidebarOverlay").classList.remove("show")};
 $("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("barbie-dark",document.body.classList.contains("dark"));toast("Theme updated")};
 if(localStorage.getItem("barbie-dark")==="true")document.body.classList.add("dark");
 $("#notificationBtn").onclick=()=>$("#notificationPanel").classList.toggle("hidden");
 $("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){const q=e.target.value.toLowerCase();if(q.includes("student"))location.hash="students";else if(q.includes("teacher"))location.hash="teachers";else if(q.includes("class"))location.hash="classes";else if(q.includes("grade"))location.hash="grades";else toast("Try: students, teachers, classes, or grades") }});
 renderPage();
}
loadData().then(setup);