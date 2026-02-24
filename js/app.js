(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ---------- Time ----------
  const timeEl = $("#time");
  function setTime(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    if(timeEl) timeEl.textContent = `${hh}:${mm}`;
  }
  setTime();
  setInterval(setTime, 30000);

  // ---------- Toast (solo para microfeedback, no “demo”) ----------
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toast]");
    if(!t) return;
    showToast(t.dataset.toast);
  });

  // ---------- Sidebar ----------
  const sidebar = $("#sidebar");
  const backdrop = $("#backdrop");
  const btnMenu = $("#btnMenu");

  function openSidebar(){
    sidebar?.classList.add("open");
    backdrop?.classList.add("open");
  }
  function closeSidebar(){
    sidebar?.classList.remove("open");
    backdrop?.classList.remove("open");
  }
  btnMenu?.addEventListener("click", openSidebar);
  backdrop?.addEventListener("click", closeSidebar);

  // ---------- Navigation ----------
  const pages = $$(".page");
  const sideItems = $$(".sideItem");

  function setActiveNav(name){
    sideItems.forEach(b => b.classList.toggle("is-active", b.dataset.nav === name));
  }

  function goTo(name){
    pages.forEach(p => p.classList.toggle("is-active", p.dataset.page === name));
    setActiveNav(name);
    closeSidebar();
    if (name !== "feed") {
        pauseAllFeedVideos();
    }
    const active = pages.find(p => p.dataset.page === name);
    if(active) active.scrollTo({top:0, behavior:"smooth"});

    if(name === "feed") setTimeout(() => autoPlayVisibleFeedVideo(), 60);
  }

  document.addEventListener("click", (e) => {
    const n = e.target.closest("[data-nav]");
    if(!n) return;
    goTo(n.dataset.nav);
  });

  // ---------- Calendar data model ----------
  // schedule[YYYY-MM-DD] = { events: [...], checklist:[...] }
  const schedule = {
    "2026-02-24": {
      events: [
        { type:"med", title:"Paracetamol 1g", time:"12:00", note:"Después de comer" },
        { type:"appt", title:"Fisioterapia", time:"18:30", note:"Clínica Centro" }
      ],
      checklist: [
        { text: "Ejercicios de movilidad (10 min)", done: false },
        { text: "Hidratación y merienda", done: true },
        { text: "Preparar medicación de noche", done: false }
      ]
    },
    "2026-02-25": {
      events: [
        { type:"med", title:"Vitamina D", time:"09:00", note:"Con desayuno" }
      ],
      checklist: [
        { text: "Paseo corto / aire", done: false },
        { text: "Estiramientos suaves", done: false }
      ]
    },
    "2026-02-28": {
      events: [
        { type:"appt", title:"Médico de familia", time:"10:15", note:"Revisión" },
        { type:"med", title:"Ibuprofeno", time:"21:30", note:"Solo si dolor" }
      ],
      checklist: [
        { text: "Preparar documentos de la cita", done: false }
      ]
    }
  };

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  function ymd(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const da = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${da}`;
  }

  function ensureDay(key){
    schedule[key] = schedule[key] || { events: [], checklist: [] };
    schedule[key].events = schedule[key].events || [];
    schedule[key].checklist = schedule[key].checklist || [];
    return schedule[key];
  }

  function hasAnyFor(d){
    const day = schedule[ymd(d)];
    if(!day) return false;
    return (day.events?.length || 0) + (day.checklist?.length || 0) > 0;
  }

  function mondayIndex(jsDay){ // 0 Sun..6 Sat -> 0 Mon..6 Sun
    return (jsDay + 6) % 7;
  }

  // ---------- Calendar UI refs ----------
  const calGrid = $("#calGrid");
  const calTitle = $("#calTitle");
  const dayTitle = $("#dayTitle");
  const dayEvents = $("#dayEvents");
  const calPrev = $("#calPrev");
  const calNext = $("#calNext");
  const btnAddEvent = $("#btnAddEvent");

  const dayChecklist = $("#dayChecklist");
  const checkMeta = $("#checkMeta");
  const btnChecklistReset = $("#btnChecklistReset");
  const btnAddTask = $("#btnAddTask");

  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();
  let selectedDate = new Date(viewYear, viewMonth, now.getDate());

  function renderCalendar(){
    if(!calGrid || !calTitle) return;

    calTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    calGrid.innerHTML = "";

    const first = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    const startPad = mondayIndex(first.getDay());
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    for(let i=0;i<42;i++){
      const cell = document.createElement("button");
      cell.className = "dayCell";

      let dayNum, cellDate, muted=false;

      if(i < startPad){
        dayNum = prevMonthDays - (startPad - 1 - i);
        cellDate = new Date(viewYear, viewMonth-1, dayNum);
        muted = true;
      } else if(i >= startPad + daysInMonth){
        dayNum = i - (startPad + daysInMonth) + 1;
        cellDate = new Date(viewYear, viewMonth+1, dayNum);
        muted = true;
      } else {
        dayNum = i - startPad + 1;
        cellDate = new Date(viewYear, viewMonth, dayNum);
      }

      if(muted) cell.classList.add("muted");
      if(ymd(cellDate) === ymd(selectedDate)) cell.classList.add("selected");

      cell.textContent = String(dayNum);

      if(hasAnyFor(cellDate)){
        const dot = document.createElement("span");
        dot.className = "dot";
        cell.appendChild(dot);
      }

      cell.addEventListener("click", () => {
        viewYear = cellDate.getFullYear();
        viewMonth = cellDate.getMonth();
        selectedDate = cellDate;
        renderCalendar();
        renderDay();
      });

      calGrid.appendChild(cell);
    }
  }

  function renderEvents(){
    if(!dayTitle || !dayEvents) return;
    const d = selectedDate;
    const pretty = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    dayTitle.textContent = `Eventos · ${pretty}`;

    const key = ymd(d);
    const day = ensureDay(key);
    const items = day.events.slice().sort((a,b)=>a.time.localeCompare(b.time));

    dayEvents.innerHTML = "";

    if(items.length === 0){
      const empty = document.createElement("div");
      empty.className = "listCard soft";
      empty.innerHTML = `
        <div class="pillTag softTag">Sin eventos</div>
        <div class="lcTitle">No hay citas ni medicación</div>
        <div class="lcSub">Puedes añadir un evento</div>
      `;
      dayEvents.appendChild(empty);
      return;
    }

    items.forEach(ev => {
      const card = document.createElement("div");
      card.className = "listCard";

      const tagClass = ev.type === "med" ? "pink" : "rose";
      const tagText  = ev.type === "med" ? "Medicación" : "Cita";

      card.innerHTML = `
        <div class="pillTag ${tagClass}">${tagText}</div>
        <div class="lcTitle">${ev.title}</div>
        <div class="lcSub">${ev.time} · ${ev.note || ""}</div>
        <button class="miniBtn" data-toast="Listo">OK</button>
      `;

      dayEvents.appendChild(card);
    });
  }

  function renderChecklist(){
    if(!dayChecklist || !checkMeta) return;

    const key = ymd(selectedDate);
    const day = ensureDay(key);

    dayChecklist.innerHTML = "";

    if(day.checklist.length === 0){
      dayChecklist.innerHTML = `
        <div class="listCard soft" style="box-shadow:none;">
          <div class="pillTag softTag">Sin tareas</div>
          <div class="lcTitle">Checklist vacía</div>
          <div class="lcSub">Añade tareas para este día</div>
        </div>
      `;
      checkMeta.textContent = "0/0 completados";
      return;
    }

    day.checklist.forEach((t, idx) => {
      const row = document.createElement("label");
      row.className = "checkItem";
      row.innerHTML = `
        <input type="checkbox" ${t.done ? "checked" : ""} data-check="${idx}" />
        <span class="checkText">${t.text}</span>
      `;
      dayChecklist.appendChild(row);
    });

    const done = day.checklist.filter(x=>x.done).length;
    checkMeta.textContent = `${done}/${day.checklist.length} completados`;
  }

  function renderDay(){
    renderEvents();
    renderChecklist();
  }

  calPrev?.addEventListener("click", () => {
    const d = new Date(viewYear, viewMonth-1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    selectedDate = new Date(viewYear, viewMonth, 1);
    renderCalendar();
    renderDay();
  });

  calNext?.addEventListener("click", () => {
    const d = new Date(viewYear, viewMonth+1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    selectedDate = new Date(viewYear, viewMonth, 1);
    renderCalendar();
    renderDay();
  });

  btnAddEvent?.addEventListener("click", () => {
    const key = ymd(selectedDate);
    const day = ensureDay(key);

    // evento simple (placeholder funcional)
    day.events.push({
      type: Math.random() > 0.5 ? "med" : "appt",
      title: Math.random() > 0.5 ? "Medicamento" : "Cita",
      time: Math.random() > 0.5 ? "09:30" : "17:45",
      note: "Añadido"
    });

    renderCalendar();
    renderDay();
    showToast("Evento añadido");
  });

  document.addEventListener("change", (e) => {
    const cb = e.target.closest("[data-check]");
    if(!cb) return;

    const key = ymd(selectedDate);
    const day = ensureDay(key);
    const idx = Number(cb.dataset.check);
    if(Number.isNaN(idx) || !day.checklist[idx]) return;

    day.checklist[idx].done = cb.checked;
    renderChecklist();
    renderCalendar();
  });

  btnChecklistReset?.addEventListener("click", () => {
    const key = ymd(selectedDate);
    const day = ensureDay(key);
    day.checklist.forEach(t => t.done = false);
    renderChecklist();
    renderCalendar();
    showToast("Checklist restablecida");
  });

  btnAddTask?.addEventListener("click", () => {
    const key = ymd(selectedDate);
    const day = ensureDay(key);
    day.checklist.push({ text: "Nueva tarea", done: false });
    renderChecklist();
    renderCalendar();
    showToast("Tarea añadida");
  });

  // ---------- Chat ----------
  const chatBody = $("#chatBody");
  const chatInput = $("#chatInput");
  const chatSend = $("#chatSend");
  const chatHint = $("#chatHint");
  const btnChatReset = $("#btnChatReset");

  let activeSpecialist = null;

  function addBubble(text, who){
    if(!chatBody) return;
    const b = document.createElement("div");
    b.className = `bubble ${who}`;
    b.textContent = text;
    chatBody.appendChild(b);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior:"smooth" });
  }

  function setSpecialist(name){
    activeSpecialist = name;
    $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.specialist === name));
    if(chatHint) chatHint.textContent = `Conectado con ${name}.`;
    addBubble(`Hola, soy ${name}. ¿En qué puedo ayudarte?`, "pro");
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-specialist]");
    if(!c) return;
    setSpecialist(c.dataset.specialist);
  });

  function botReply(){
    const base = [
      "Gracias. ¿Desde cuándo ocurre y con qué intensidad?",
      "Entiendo. ¿Hay algo que lo empeore o lo mejore claramente?",
      "Te propongo una pauta: divide en pasos, prioriza seguridad y descansa en micro-bloques."
    ];
    const msg = base[Math.floor(Math.random()*base.length)];
    setTimeout(() => addBubble(msg, "pro"), 450);
  }

  function sendChatMsg(){
    const t = (chatInput?.value || "").trim();
    if(!t) return;
    if(!activeSpecialist){
      showToast("Selecciona una especialidad");
      return;
    }
    addBubble(t, "me");
    if(chatInput) chatInput.value = "";
    botReply();
  }

  chatSend?.addEventListener("click", sendChatMsg);
  chatInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") sendChatMsg();
  });

  function resetChat(){
    if(!chatBody) return;
    chatBody.innerHTML = "";
    activeSpecialist = null;
    $$(".chip").forEach(c => c.classList.remove("active"));
    if(chatHint) chatHint.textContent = "Selecciona una especialidad para empezar.";
    addBubble("Bienvenido/a. Selecciona especialidad para comenzar.", "pro");
  }

  btnChatReset?.addEventListener("click", () => {
    resetChat();
    showToast("Chat restablecido");
  });

  // ---------- Feed (Formación) ----------
  const feedContainer = $("#feedContainer");
  const drawer = $("#drawer");
  const drawerBackdrop = $("#drawerBackdrop");
  const drawerBody = $("#drawerBody");
  const drawerClose = $("#drawerClose");
  const drawerSend = $("#drawerSend");
  const drawerInput = $("#drawerInput");

  // Preparado: solo poner videos en assets/videos/
  const feedData = [
    { id: "v1", src: "assets/videos/demo1.mp4", title: "Mindfulness en 60s", sub: "Respira 4-4-6 y baja tensión mental" },
    { id: "v2", src: "assets/videos/demo2.mp4", title: "Movilización segura", sub: "Espalda neutra · apoyo · evita tirones" },
    { id: "v3", src: "assets/videos/demo3.mp4", title: "Estiramiento breve", sub: "2 minutos para cuello y hombros" }
  ];

  const feedState = {};
  feedData.forEach(v => {
    feedState[v.id] = {
      likes: Math.floor(20 + Math.random()*120),
      liked: false,
      comments: [
        { who: "Ana", txt: "Me viene genial para el día a día." },
        { who: "Marco", txt: "Muy claro y directo." }
      ]
    };
  });
function pauseAllFeedVideos(){
  document.querySelectorAll(".feedVideo").forEach(v => {
    v.pause();
  });
}
  function renderFeed(){
    if(!feedContainer) return;
    feedContainer.innerHTML = "";

    feedData.forEach(v => {
      const st = feedState[v.id];

      const item = document.createElement("section");
      item.className = "feedItem";
      item.dataset.feedId = v.id;

      item.innerHTML = `
        <video class="feedVideo" src="${v.src}" playsinlineloop></video>
        <div class="feedOverlay"></div>

        <div class="feedMeta">
          <div class="title">${v.title}</div>
          <div class="sub">${v.sub}</div>
        </div>

        <div class="feedActions">
          <div class="fabWrap">
            <button class="fab ${st.liked ? "liked":""}" data-like="${v.id}" aria-label="Me gusta">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-7-4.35-9.5-8.2C.2 9.2 2.1 5.7 5.8 5.2c2-.3 3.6.7 4.6 2 1-1.3 2.6-2.3 4.6-2 3.7.5 5.6 4 3.3 7.6C19 16.65 12 21 12 21z"/>
              </svg>
            </button>
            <div class="fabCount" id="likes-${v.id}">${st.likes}</div>
          </div>

          <div class="fabWrap">
            <button class="fab" data-comments="${v.id}" aria-label="Comentarios">
              <svg viewBox="0 0 24 24">
                <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 9h12v2H6V9zm0-4h12v2H6V5z"/>
              </svg>
            </button>
            <div class="fabCount" id="com-${v.id}">${st.comments.length}</div>
          </div>

          <div class="fabWrap">
            <button class="fab" data-toast="Guardado" aria-label="Guardar">
              <svg viewBox="0 0 24 24">
                <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"/>
              </svg>
            </button>
            <div class="fabCount">Guardar</div>
          </div>
        </div>
      `;

      feedContainer.appendChild(item);
    });

    setTimeout(() => autoPlayVisibleFeedVideo(), 80);
  }

  function autoPlayVisibleFeedVideo(){
    if(!feedContainer) return;
    const items = $$(".feedItem", feedContainer);
    const rectC = feedContainer.getBoundingClientRect();

    let best = null;
    let bestScore = -Infinity;

    items.forEach(it => {
      const r = it.getBoundingClientRect();
      const visibleTop = Math.max(r.top, rectC.top);
      const visibleBot = Math.min(r.bottom, rectC.bottom);
      const visible = Math.max(0, visibleBot - visibleTop);
      if(visible > bestScore){
        bestScore = visible;
        best = it;
      }
    });

    items.forEach(it => {
      const v = $("video", it);
      if(!v) return;
      if(it === best){
        v.play().catch(()=>{});
      } else {
        v.pause();
      }
    });
  }

  feedContainer?.addEventListener("scroll", () => {
    window.clearTimeout(feedContainer._t);
    feedContainer._t = setTimeout(() => autoPlayVisibleFeedVideo(), 80);
  });

  document.addEventListener("click", (e) => {
    const likeBtn = e.target.closest("[data-like]");
    if(likeBtn){
      const id = likeBtn.dataset.like;
      const st = feedState[id];
      if(!st) return;

      st.liked = !st.liked;
      st.likes += st.liked ? 1 : -1;

      likeBtn.classList.toggle("liked", st.liked);
      const likesEl = $(`#likes-${id}`);
      if(likesEl) likesEl.textContent = st.likes;
      return;
    }

    const comBtn = e.target.closest("[data-comments]");
    if(comBtn){
      openComments(comBtn.dataset.comments);
      return;
    }
  });

  let currentCommentsId = null;

  function openComments(id){
    currentCommentsId = id;
    drawerBackdrop?.classList.add("open");
    drawer?.classList.add("open");
    drawer?.setAttribute("aria-hidden","false");
    drawerBackdrop?.setAttribute("aria-hidden","false");
    renderComments(id);
  }

  function closeComments(){
    drawerBackdrop?.classList.remove("open");
    drawer?.classList.remove("open");
    drawer?.setAttribute("aria-hidden","true");
    drawerBackdrop?.setAttribute("aria-hidden","true");
    currentCommentsId = null;
  }

  drawerBackdrop?.addEventListener("click", closeComments);
  drawerClose?.addEventListener("click", closeComments);

  function renderComments(id){
    if(!drawerBody) return;
    const st = feedState[id];
    drawerBody.innerHTML = "";
    st.comments.forEach(c => {
      const div = document.createElement("div");
      div.className = "comment";
      div.innerHTML = `<div class="who">${c.who}</div><div class="txt">${c.txt}</div>`;
      drawerBody.appendChild(div);
    });
  }

  drawerSend?.addEventListener("click", () => {
    const txt = (drawerInput?.value || "").trim();
    if(!txt || !currentCommentsId) return;
    feedState[currentCommentsId].comments.push({ who: "Tú", txt });
    if(drawerInput) drawerInput.value = "";
    renderComments(currentCommentsId);
    const comEl = $(`#com-${currentCommentsId}`);
    if(comEl) comEl.textContent = feedState[currentCommentsId].comments.length;
    showToast("Comentario añadido");
  });

  drawerInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") drawerSend?.click();
  });

  // ---------- Community (foro: posts -> página) ----------
  const forumList = $("#forumList");
  const btnNewPost = $("#btnNewPost");
  const postBackdrop = $("#postBackdrop");
  const postModal = $("#postModal");
  const postClose = $("#postClose");
  const pmTitle = $("#pmTitle");
  const pmBody = $("#pmBody");
  const pmSend = $("#pmSend");
  const pmInput = $("#pmInput");

  const forumData = [
    {
      id: "p1",
      category: "Salud mental",
      author: "Carlos",
      time: "Hace 2 horas",
      title: "¿Cómo gestionáis el cansancio mental sin culpa?",
      text: "Hay días que no puedo más. ¿Algún método realista para aguantar sin reventar?",
      likes: 127,
      comments: [
        { who:"Marta", time:"Hace 1 hora", txt:"Bloques de 15 minutos + micro descansos. Y pedir relevo sin negociar con la culpa." },
        { who:"Sergio", time:"Hace 45 min", txt:"Si hay carga física, el cansancio mental se multiplica. Simplifica rutinas y protege espalda." },
        { who:"Lucía", time:"Hace 25 min", txt:"Busca respiro familiar si puedes. No es un lujo, es sostenibilidad." }
      ]
    },
    {
      id: "p2",
      category: "Recursos",
      author: "Ana",
      time: "Ayer",
      title: "¿Grupos o asociaciones recomendables en mi zona?",
      text: "Me ayudaría conocer experiencias reales con asociaciones o centros de apoyo.",
      likes: 63,
      comments: [
        { who:"Pablo", time:"Ayer", txt:"Pregunta en el centro de salud por trabajador/a social. Te orientan con recursos cercanos." },
        { who:"Elena", time:"Ayer", txt:"Centro de día 2 mañanas fue un antes y después. Descansar también es cuidar." }
      ]
    }
  ];

  const forumState = {};
  forumData.forEach(p => {
    forumState[p.id] = { likes: p.likes, liked: false, comments: [...p.comments] };
  });

  function renderForum(){
    if(!forumList) return;
    forumList.innerHTML = "";

    forumData.forEach(p => {
      const st = forumState[p.id];

      const row = document.createElement("article");
      row.className = "fPost";
      row.dataset.postId = p.id;

      row.innerHTML = `
        <div class="reactCol" data-stop>
          <button class="reactBtn ${st.liked ? "liked" : ""}" data-likepost="${p.id}" aria-label="Me gusta">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7-4.35-9.5-8.2C.2 9.2 2.1 5.7 5.8 5.2c2-.3 3.6.7 4.6 2 1-1.3 2.6-2.3 4.6-2 3.7.5 5.6 4 3.3 7.6C19 16.65 12 21 12 21z"/>
            </svg>
          </button>
          <div class="reactCount" id="plike-${p.id}">${st.likes}</div>
        </div>

        <div class="fBody">
          <div class="fMeta">${p.category} · ${p.author} · ${p.time}</div>
          <div class="fTitle">${p.title}</div>
          <div class="fText">${p.text}</div>
          <div class="fFooter">
            <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
            <span id="pc-${p.id}">${st.comments.length} comentarios</span>
          </div>
        </div>
      `;

      forumList.appendChild(row);
    });
  }

  document.addEventListener("click", (e) => {
    const likePost = e.target.closest("[data-likepost]");
    if(likePost){
      const id = likePost.dataset.likepost;
      const st = forumState[id];
      if(!st) return;

      st.liked = !st.liked;
      st.likes += st.liked ? 1 : -1;

      const countEl = $(`#plike-${id}`);
      if(countEl) countEl.textContent = st.likes;
      return;
    }

    const post = e.target.closest(".fPost");
    if(post){
      if(e.target.closest("[data-stop]")) return;
      openPost(post.dataset.postId);
    }
  });

  function openPost(id){
    const p = forumData.find(x => x.id === id);
    const st = forumState[id];
    if(!p || !st) return;

    pmTitle.textContent = p.title;

    pmBody.innerHTML = `
      <div class="listCard" style="margin-bottom:10px;">
        <div class="pillTag rose">${p.category}</div>
        <div class="lcTitle">${p.title}</div>
        <div class="lcSub">${p.author} · ${p.time}</div>
        <div class="lcSub" style="margin-top:10px; color: rgba(31,27,36,.74);">${p.text}</div>
        <button class="miniBtn" id="pmLike" aria-label="Me gusta">❤</button>
      </div>

      <div class="thread" id="thread"></div>
    `;

    const pmLike = $("#pmLike", pmBody);
    pmLike?.addEventListener("click", () => {
      st.liked = !st.liked;
      st.likes += st.liked ? 1 : -1;
      const countEl = $(`#plike-${id}`);
      if(countEl) countEl.textContent = st.likes;
      showToast("Reacción actualizada");
    });

    const thread = $("#thread", pmBody);
    st.comments.forEach(c => {
      const el = document.createElement("div");
      el.className = "tComment";
      el.innerHTML = `
        <div class="top">
          <div class="who">${c.who}</div>
          <div class="time">${c.time}</div>
        </div>
        <div class="txt">${c.txt}</div>
      `;
      thread.appendChild(el);
    });

    postBackdrop.classList.add("open");
    postModal.classList.add("open");
    postModal.dataset.openId = id;
    postBackdrop.setAttribute("aria-hidden","false");
    postModal.setAttribute("aria-hidden","false");
  }

  function closePost(){
    postBackdrop.classList.remove("open");
    postModal.classList.remove("open");
    postModal.dataset.openId = "";
    postBackdrop.setAttribute("aria-hidden","true");
    postModal.setAttribute("aria-hidden","true");
  }

  postBackdrop?.addEventListener("click", closePost);
  postClose?.addEventListener("click", closePost);

  pmSend?.addEventListener("click", () => {
    const id = postModal.dataset.openId;
    if(!id) return;

    const txt = (pmInput?.value || "").trim();
    if(!txt) return;

    forumState[id].comments.push({ who:"Tú", time:"Ahora", txt });
    if(pmInput) pmInput.value = "";

    const cEl = $(`#pc-${id}`);
    if(cEl) cEl.textContent = `${forumState[id].comments.length} comentarios`;

    openPost(id);
    showToast("Comentario añadido");
  });

  pmInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") pmSend?.click();
  });

  btnNewPost?.addEventListener("click", () => {
    showToast("Función de publicación en preparación");
  });

  // ---------- Init ----------
  function init(){
    goTo("home");
    renderCalendar();
    renderDay();
    resetChat();
    renderFeed();
    renderForum();
  }

  init();
})();