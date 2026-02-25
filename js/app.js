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

  // ---------- Toast ----------
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
  backdrop?.addEventListener("click", () => {
    closeSidebar();
    // si overlay cierra también feed drawer por seguridad
    closeComments();
  });

  // ---------- Navigation ----------
  const pages = $$(".page");
  const sideItems = $$(".sideItem");
  let lastPage = "home";

  function setActiveNav(name){
    sideItems.forEach(b => b.classList.toggle("is-active", b.dataset.nav === name));
  }

  function goTo(name, opts = {}){
    pages.forEach(p => p.classList.toggle("is-active", p.dataset.page === name));
    setActiveNav(name);
    closeSidebar();

    // reglas vídeo: nunca en segundo plano
    if (name !== "feed") pauseAllFeedVideos();
    if (name !== "feed") closeComments();

    // scroll top
    const active = pages.find(p => p.dataset.page === name);
    if(active && !opts.keepScroll) active.scrollTo({top:0, behavior:"smooth"});

    if(name === "feed") setTimeout(() => autoPlayVisibleFeedVideo(), 60);

    // remember
    if(!opts.silent) lastPage = name;
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

  function mondayIndex(jsDay){
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
        renderHome();
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
        <div class="lcTitle">${escapeHtml(ev.title)}</div>
        <div class="lcSub">${escapeHtml(ev.time)} · ${escapeHtml(ev.note || "")}</div>
        <button class="miniBtn" data-toast="Marcado">OK</button>
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
        <span class="checkText">${escapeHtml(t.text)}</span>
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
    renderHome();
  });

  calNext?.addEventListener("click", () => {
    const d = new Date(viewYear, viewMonth+1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    selectedDate = new Date(viewYear, viewMonth, 1);
    renderCalendar();
    renderDay();
    renderHome();
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
    renderHome();
  });

  btnChecklistReset?.addEventListener("click", () => {
    const key = ymd(selectedDate);
    const day = ensureDay(key);
    day.checklist.forEach(t => t.done = false);
    renderChecklist();
    renderCalendar();
    renderHome();
    showToast("Checklist restablecida");
  });

  // ---------- Sheet modal for add event / task ----------
  const sheetBackdrop = $("#sheetBackdrop");
  const sheet = $("#sheet");
  const sheetTitle = $("#sheetTitle");
  const sheetSub = $("#sheetSub");
  const sheetBody = $("#sheetBody");
  const sheetClose = $("#sheetClose");
  const sheetCancel = $("#sheetCancel");
  const sheetSave = $("#sheetSave");

  let sheetCtx = null;

  function openSheet(ctx){
    sheetCtx = ctx;
    if(sheetTitle) sheetTitle.textContent = ctx.title || "Añadir";
    if(sheetSub) sheetSub.textContent = ctx.sub || "Completa los datos";
    if(sheetBody) sheetBody.innerHTML = ctx.html || "";

    sheetBackdrop?.classList.add("open");
    sheet?.classList.add("open");
    sheetBackdrop?.setAttribute("aria-hidden","false");
    sheet?.setAttribute("aria-hidden","false");

    // focus first input
    setTimeout(() => {
      const firstInput = sheetBody?.querySelector("input,select");
      firstInput?.focus?.();
    }, 80);
  }

  function closeSheet(){
    sheetBackdrop?.classList.remove("open");
    sheet?.classList.remove("open");
    sheetBackdrop?.setAttribute("aria-hidden","true");
    sheet?.setAttribute("aria-hidden","true");
    sheetCtx = null;
  }

  sheetBackdrop?.addEventListener("click", closeSheet);
  sheetClose?.addEventListener("click", closeSheet);
  sheetCancel?.addEventListener("click", closeSheet);

  sheetSave?.addEventListener("click", () => {
    if(!sheetCtx?.onSave) return closeSheet();
    const res = sheetCtx.onSave(sheetBody);
    if(res === false) return; // prevent close if validation fails
    closeSheet();
  });

  btnAddEvent?.addEventListener("click", () => {
    const defaultTime = "09:00";
    openSheet({
      title: "Añadir evento",
      sub: "Elige tipo, nombre y hora",
      html: `
        <div class="field">
          <label>Tipo</label>
          <select id="evType">
            <option value="med">Medicación</option>
            <option value="appt">Cita</option>
          </select>
        </div>
        <div class="field">
          <label>Nombre</label>
          <input id="evTitle" type="text" placeholder="Ej: Paracetamol 1g / Fisioterapia" />
        </div>
        <div class="field">
          <label>Hora</label>
          <input id="evTime" type="time" value="${defaultTime}" />
        </div>
        <div class="field">
          <label>Nota (opcional)</label>
          <input id="evNote" type="text" placeholder="Ej: después de comer / clínica..." />
        </div>
      `,
      onSave: (root) => {
        const type = $("#evType", root)?.value || "appt";
        const title = ($("#evTitle", root)?.value || "").trim();
        const time = $("#evTime", root)?.value || "09:00";
        const note = ($("#evNote", root)?.value || "").trim();

        if(!title){
          showToast("Pon un nombre");
          $("#evTitle", root)?.focus?.();
          return false;
        }

        const key = ymd(selectedDate);
        const day = ensureDay(key);
        day.events.push({ type, title, time, note });

        renderCalendar();
        renderDay();
        renderHome();
        showToast("Evento añadido");
      }
    });
  });

  btnAddTask?.addEventListener("click", () => {
    openSheet({
      title: "Añadir tarea",
      sub: "Escribe el nombre de la tarea",
      html: `
        <div class="field">
          <label>Nombre</label>
          <input id="taskTitle" type="text" placeholder="Ej: Estiramientos 5 min" />
        </div>
      `,
      onSave: (root) => {
        const title = ($("#taskTitle", root)?.value || "").trim();
        if(!title){
          showToast("Pon un nombre");
          $("#taskTitle", root)?.focus?.();
          return false;
        }
        const key = ymd(selectedDate);
        const day = ensureDay(key);
        day.checklist.push({ text: title, done: false });
        renderChecklist();
        renderCalendar();
        renderHome();
        showToast("Tarea añadida");
      }
    });
  });

  // ---------- HOME rendering ----------
  const homeChecklist = $("#homeChecklist");
  const homeEvents = $("#homeEvents");
  const homeStatus = $("#homeStatus");
  const homeProgressPct = $("#homeProgressPct");
  const ringProg = $(".ringProg");
  const homeUpcoming = $("#homeUpcoming");

  function computeTodayStats(){
    const key = ymd(selectedDate);
    const day = ensureDay(key);
    const total = day.checklist.length;
    const done = day.checklist.filter(x=>x.done).length;
    const eventsCount = day.events.length;

    const pct = total === 0 ? (eventsCount ? 20 : 0) : Math.round((done / total) * 100);
    const status = (pct >= 70) ? "Muy bien" : (pct >= 35 ? "En marcha" : "Inicio");

    return { done, total, eventsCount, pct, status, day };
  }

  function renderHome(){
    const st = computeTodayStats();

    if(homeChecklist) homeChecklist.textContent = `${st.done}/${st.total}`;
    if(homeEvents) homeEvents.textContent = `${st.eventsCount}`;
    if(homeStatus) homeStatus.textContent = st.status;

    if(homeProgressPct) homeProgressPct.textContent = `${st.pct}%`;
    if(ringProg){
      const circumference = 289;
      const off = circumference - (st.pct/100)*circumference;
      ringProg.style.strokeDashoffset = String(off);
    }

    if(homeUpcoming){
      homeUpcoming.innerHTML = "";
      const items = st.day.events.slice().sort((a,b)=>a.time.localeCompare(b.time)).slice(0, 3);

      if(items.length === 0){
        const empty = document.createElement("div");
        empty.className = "listCard soft";
        empty.innerHTML = `
          <div class="pillTag softTag">Sin eventos</div>
          <div class="lcTitle">Agenda tranquila</div>
          <div class="lcSub">Puedes añadir un evento desde Calendario</div>
        `;
        homeUpcoming.appendChild(empty);
      } else {
        items.forEach(ev => {
          const card = document.createElement("div");
          card.className = "listCard";
          const tagClass = ev.type === "med" ? "pink" : "rose";
          const tagText  = ev.type === "med" ? "Medicación" : "Cita";

          card.innerHTML = `
            <div class="pillTag ${tagClass}">${tagText}</div>
            <div class="lcTitle">${escapeHtml(ev.title)}</div>
            <div class="lcSub">${escapeHtml(ev.time)} · ${escapeHtml(ev.note || "")}</div>
          `;
          homeUpcoming.appendChild(card);
        });
      }
    }
  }

  // ---------- Chat ----------
  const chatBody = $("#chatBody");
  const chatInput = $("#chatInput");
  const chatSend = $("#chatSend");
  const chatHint = $("#chatHint");
  const btnChatReset = $("#btnChatReset");

  let activeSpecialist = null;

  const chatMemory = {
    // specialist -> { step:int, context: {...} }
  };

  function addBubble(text, who, opts = {}){
    if(!chatBody) return;
    const b = document.createElement("div");
    b.className = `bubble ${who}${opts.typing ? " typing" : ""}`;
    b.textContent = text;
    chatBody.appendChild(b);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior:"smooth" });
    return b;
  }

  function removeBubble(el){
    if(el && el.parentNode) el.parentNode.removeChild(el);
  }

  function typingDelay(ms){
    return new Promise(res => setTimeout(res, ms));
  }

  const scripts = {
    "Psicología": {
      intro: [
        "Hola, soy Laura (psicóloga). Estoy aquí para ayudarte con claridad y sin juzgar.",
        "Antes de empezar: ¿qué te pesa más hoy, ansiedad, culpa o agotamiento?",
        "Y una rápida: ¿duermes razonablemente o estás en modo supervivencia?"
      ],
      flow: async (userText, mem) => {
        // mem.step: 0..n
        const t = userText.toLowerCase();

        if(mem.step === 0){
          mem.step++;
          return [
            "Gracias por contarlo. Vamos a hacerlo práctico.",
            "Dime 1 cosa concreta que te preocupa (una sola).",
          ];
        }

        if(mem.step === 1){
          mem.step++;
          return [
            "Vale. Para bajar carga mental hoy: elige 1 prioridad y 2 'mínimos'.",
            "Ejemplo: prioridad = medicación/seguridad. Mínimos = comer + 10 min de pausa.",
            "¿Cuál sería tu prioridad de hoy?"
          ];
        }

        if(mem.step === 2){
          mem.step++;
          return [
            "Perfecto. Ahora lo convertimos en plan de 3 pasos:",
            "1) Haz lo urgente (15 min). 2) Microdescanso (3 min). 3) Tarea mínima (10 min).",
            "Si quieres, te ayudo a redactar tus 3 pasos con lo que me acabas de decir."
          ];
        }

        // loop
        return [
          "Te leo. Si me dices contexto (tiempo, energía, apoyo), ajusto el plan a algo realista."
        ];
      }
    },

    "Fisioterapia": {
      intro: [
        "Hola, soy Dani (fisioterapeuta). Vamos a priorizar seguridad y técnica.",
        "¿Dónde notas más carga: lumbar, cervical, hombros o piernas?",
        "¿Hay dolor agudo (pinchazo) o es más tensión/cansancio?"
      ],
      flow: async (userText, mem) => {
        if(mem.step === 0){
          mem.step++;
          return [
            "Entendido. Te doy una pauta segura y corta.",
            "Haz esto 2 minutos: hombros atrás, cuello largo, respiración lenta (4-4-6).",
            "¿Puedes caminar 3-5 minutos hoy o estás muy limitado/a?"
          ];
        }
        if(mem.step === 1){
          mem.step++;
          return [
            "Bien. Para mover sin lesionarte:",
            "— Pies separados, espalda neutra, carga pegada al cuerpo.",
            "— Si giras: gira con pies, no con la cintura.",
            "¿Qué movimiento te da más miedo ahora mismo?"
          ];
        }
        return [
          "Vale. Si me dices el movimiento exacto, lo desgloso en 3 cues simples para hacerlo bien."
        ];
      }
    },

    "Trabajo Social": {
      intro: [
        "Hola, soy Sara (trabajadora social). Te ayudo a encontrar recursos y pasos claros.",
        "¿Buscas apoyo por dependencia, ayudas económicas o respiro familiar?",
        "¿En Valencia ciudad o alrededores?"
      ],
      flow: async (userText, mem) => {
        if(mem.step === 0){
          mem.step++;
          return [
            "Perfecto. Te propongo un camino corto:",
            "1) Centro de salud: pide cita con trabajo social sanitario.",
            "2) Reúne: DNI, empadronamiento, informe médico (si lo tienes).",
            "¿Tienes ya informes o partes médicos?"
          ];
        }
        if(mem.step === 1){
          mem.step++;
          return [
            "Si no tienes, no pasa nada: empezamos con lo básico.",
            "¿Quieres que te haga una lista de documentos personalizada (3-5 ítems) según tu caso?"
          ];
        }
        return [
          "Te acompaño con esto. Si me dices tu objetivo (ej: respiro, ayuda, dependencia), lo aterrizo en pasos."
        ];
      }
    },

    "Medicina": {
      intro: [
        "Hola, soy Víctor (médico). Voy a preguntarte lo mínimo para orientar bien.",
        "¿Qué síntoma o problema principal quieres comentar?",
        "¿Hay fiebre, dificultad respiratoria, dolor fuerte o algo que te preocupe urgentemente?"
      ],
      flow: async (userText, mem) => {
        if(mem.step === 0){
          mem.step++;
          return [
            "Gracias. Para orientarte: ¿desde cuándo ocurre y cómo ha evolucionado?",
            "¿Tomas medicación habitual o hay alergias?"
          ];
        }
        if(mem.step === 1){
          mem.step++;
          return [
            "Vale. Te dejo recomendaciones generales y señales de alarma.",
            "Si aparece empeoramiento marcado, fiebre persistente o dolor intenso, toca consulta presencial.",
            "¿Quieres que lo dejemos como checklist de síntomas para monitorizar hoy?"
          ];
        }
        return [
          "Te leo. Si me dices intensidad (0-10) y tiempo, ajusto mejor la recomendación."
        ];
      }
    }
  };

  async function proSaySequence(lines){
    // typing bubble
    const typing = addBubble("…", "pro", { typing:true });
    await typingDelay(550 + Math.random()*400);
    removeBubble(typing);

    for(const line of lines){
      addBubble(line, "pro");
      await typingDelay(380 + Math.random()*280);
    }
  }

  function setSpecialist(name){
    activeSpecialist = name;
    $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.specialist === name));

    if(!chatMemory[name]) chatMemory[name] = { step: 0, context: {} };
    const mem = chatMemory[name];

    if(chatHint) chatHint.textContent = `Conectado con ${name}.`;

    // start conversation if empty for that specialist
    if(chatBody && chatBody.dataset.active !== name){
      // clear, but keep "context" across switches? En UX real se mantiene por especialista.
      chatBody.innerHTML = "";
      chatBody.dataset.active = name;
      proSaySequence(scripts[name].intro);
    }
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-specialist]");
    if(!c) return;
    setSpecialist(c.dataset.specialist);
  });

  async function sendChatMsg(){
    const t = (chatInput?.value || "").trim();
    if(!t) return;
    if(!activeSpecialist){
      showToast("Selecciona una especialidad");
      return;
    }

    addBubble(t, "me");
    if(chatInput) chatInput.value = "";

    const mem = chatMemory[activeSpecialist] || (chatMemory[activeSpecialist] = { step: 0, context:{} });

    const typing = addBubble("…", "pro", { typing:true });
    await typingDelay(600 + Math.random()*500);
    removeBubble(typing);

    const replies = await scripts[activeSpecialist].flow(t, mem);
    for(const r of replies){
      addBubble(r, "pro");
      await typingDelay(360 + Math.random()*260);
    }
  }

  chatSend?.addEventListener("click", sendChatMsg);
  chatInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") sendChatMsg();
  });

  function resetChat(){
    if(!chatBody) return;
    chatBody.innerHTML = "";
    chatBody.dataset.active = "";
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
  const drawerSub = $("#drawerSub");
  const drawerSort = $("#drawerSort");

  // Audio gating
  let userHasInteracted = false;
  const markUserInteraction = () => { userHasInteracted = true; };
  window.addEventListener("pointerdown", markUserInteraction, { once: true, passive: true });
  window.addEventListener("keydown", markUserInteraction, { once: true });

  let activeFeedVideoEl = null;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAllFeedVideos();
  });

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
        { who: "Ana", time: "Hoy", txt: "Me viene genial para el día a día." },
        { who: "Marco", time: "Hoy", txt: "Muy claro y directo." },
        { who: "Irene", time: "Ayer", txt: "Me ha ayudado a bajar tensión. Gracias." }
      ]
    };
  });

  function pauseAllFeedVideos(){
    document.querySelectorAll(".feedVideo").forEach(v => {
      v.pause();
      v.muted = true;
      v.removeAttribute("data-audio");
    });
    activeFeedVideoEl = null;
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
        <video
          class="feedVideo"
          src="${v.src}"
          playsinline
          loop
          muted
          preload="metadata"
        ></video>

        <div class="feedOverlay"></div>

        <div class="feedMeta">
          <div class="title">${escapeHtml(v.title)}</div>
          <div class="sub">${escapeHtml(v.sub)}</div>
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
            <button class="fab" data-sound="${v.id}" aria-label="Activar sonido">
              <svg viewBox="0 0 24 24">
                <path d="M5 10v4h3l4 4V6L8 10H5zm10.5 2a3.5 3.5 0 0 0-2-3.15v6.3a3.5 3.5 0 0 0 2-3.15zm2.5 0a6 6 0 0 1-3.5 5.48v-1.6A4.5 4.5 0 0 0 18 12a4.5 4.5 0 0 0-3.5-4.38V6.02A6 6 0 0 1 18 12z"/>
              </svg>
            </button>
            <div class="fabCount">Sonido</div>
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
        activeFeedVideoEl = v;
        v.muted = true; // autoplay safe
        v.play().catch(()=>{});
      } else {
        v.pause();
        v.muted = true;
        v.removeAttribute("data-audio");
      }
    });
  }

  feedContainer?.addEventListener("scroll", () => {
    window.clearTimeout(feedContainer._t);
    feedContainer._t = setTimeout(() => autoPlayVisibleFeedVideo(), 80);
  });

  // Drawer sorting
  let drawerSortMode = "recent"; // recent | top

  drawerSort?.addEventListener("click", () => {
    drawerSortMode = drawerSortMode === "recent" ? "top" : "recent";
    if(drawerSort) drawerSort.textContent = drawerSortMode === "recent" ? "Recientes" : "Populares";
    if(currentCommentsId) renderComments(currentCommentsId);
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

    const soundBtn = e.target.closest("[data-sound]");
    if(soundBtn){
      const id = soundBtn.dataset.sound;

      if(!activeFeedVideoEl){
        showToast("No hay vídeo activo");
        return;
      }
      if(!userHasInteracted){
        showToast("Toca una vez para activar audio");
        return;
      }
      const activeItem = activeFeedVideoEl.closest(".feedItem");
      if(!activeItem || activeItem.dataset.feedId !== id){
        showToast("Activa el sonido del vídeo visible");
        return;
      }

      const wantsAudio = activeFeedVideoEl.getAttribute("data-audio") !== "on";
      activeFeedVideoEl.muted = !wantsAudio;
      activeFeedVideoEl.setAttribute("data-audio", wantsAudio ? "on" : "off");
      showToast(wantsAudio ? "Audio activado" : "Audio silenciado");
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

    // pausa mientras lees comentarios
    if(activeFeedVideoEl) activeFeedVideoEl.pause();
  }

  function closeComments(){
    drawerBackdrop?.classList.remove("open");
    drawer?.classList.remove("open");
    drawer?.setAttribute("aria-hidden","true");
    drawerBackdrop?.setAttribute("aria-hidden","true");
    currentCommentsId = null;

    // reintenta autoplay al cerrar (seguirá muted)
    setTimeout(() => autoPlayVisibleFeedVideo(), 60);
  }

  drawerBackdrop?.addEventListener("click", closeComments);
  drawerClose?.addEventListener("click", closeComments);

  function initials(name){
    const parts = String(name).trim().split(/\s+/);
    const a = parts[0]?.[0] || "?";
    const b = parts.length > 1 ? parts[parts.length-1]?.[0] : "";
    return (a + b).toUpperCase();
  }

  function renderComments(id){
    if(!drawerBody) return;
    const st = feedState[id];
    if(!st) return;

    if(drawerSub) drawerSub.textContent = `${st.comments.length} comentarios`;

    drawerBody.innerHTML = "";

    let list = st.comments.slice();

    // fake "top" sort: longer text first
    if(drawerSortMode === "top"){
      list.sort((a,b) => (b.txt?.length||0) - (a.txt?.length||0));
    } else {
      // recent: keep as inserted (last newest)
      list = list.slice().reverse();
    }

    list.forEach(c => {
      const row = document.createElement("div");
      row.className = "cRow";
      row.innerHTML = `
        <div class="avatar" aria-hidden="true">${initials(c.who)}</div>
        <div class="cBubble">
          <div class="cTop">
            <div class="cWho">${escapeHtml(c.who)}</div>
            <div class="cTime">${escapeHtml(c.time || "Ahora")}</div>
          </div>
          <div class="cTxt">${escapeHtml(c.txt)}</div>
        </div>
      `;
      drawerBody.appendChild(row);
    });
  }

  drawerSend?.addEventListener("click", () => {
    const txt = (drawerInput?.value || "").trim();
    if(!txt || !currentCommentsId) return;

    // input UX: limpiar y añadir
    feedState[currentCommentsId].comments.push({ who: "Tú", time:"Ahora", txt });
    if(drawerInput) drawerInput.value = "";
    renderComments(currentCommentsId);

    const comEl = $(`#com-${currentCommentsId}`);
    if(comEl) comEl.textContent = feedState[currentCommentsId].comments.length;

    showToast("Comentario añadido");
  });

  drawerInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") drawerSend?.click();
  });

  // ---------- Community (foro: post -> page) ----------
  const forumList = $("#forumList");
  const btnNewPost = $("#btnNewPost");

  const postBack = $("#postBack");
  const postPageTitle = $("#postPageTitle");
  const postPageMeta = $("#postPageMeta");
  const postPageReact = $("#postPageReact");
  const postPageCard = $("#postPageCard");
  const postPageThread = $("#postPageThread");
  const postPageInput = $("#postPageInput");
  const postPageSend = $("#postPageSend");
  const postPageCount = $("#postPageCount");

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
          <button class="reactBtn" data-likepost="${p.id}" aria-label="Me gusta">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7-4.35-9.5-8.2C.2 9.2 2.1 5.7 5.8 5.2c2-.3 3.6.7 4.6 2 1-1.3 2.6-2.3 4.6-2 3.7.5 5.6 4 3.3 7.6C19 16.65 12 21 12 21z"/>
            </svg>
          </button>
          <div class="reactCount" id="plike-${p.id}">${st.likes}</div>
        </div>

        <div class="fBody">
          <div class="fMeta">${escapeHtml(p.category)} · ${escapeHtml(p.author)} · ${escapeHtml(p.time)}</div>
          <div class="fTitle">${escapeHtml(p.title)}</div>
          <div class="fText">${escapeHtml(p.text)}</div>
          <div class="fFooter">
            <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
            <span id="pc-${p.id}">${st.comments.length} comentarios</span>
          </div>
        </div>
      `;

      forumList.appendChild(row);
    });
  }

  let openPostId = null;

  function renderPostPage(id){
    const p = forumData.find(x => x.id === id);
    const st = forumState[id];
    if(!p || !st) return;

    openPostId = id;

    if(postPageTitle) postPageTitle.textContent = p.title;
    if(postPageMeta) postPageMeta.textContent = `${p.category} · ${p.author} · ${p.time}`;

    if(postPageCard){
      postPageCard.innerHTML = `
        <div class="pillTag rose">${escapeHtml(p.category)}</div>
        <div class="lcTitle">${escapeHtml(p.title)}</div>
        <div class="lcSub">${escapeHtml(p.author)} · ${escapeHtml(p.time)}</div>
        <div class="lcSub" style="margin-top:10px; color: rgba(31,27,36,.74);">${escapeHtml(p.text)}</div>
      `;
    }

    if(postPageCount) postPageCount.textContent = `${st.comments.length}`;

    if(postPageThread){
      postPageThread.innerHTML = "";
      st.comments.forEach(c => {
        const el = document.createElement("div");
        el.className = "tComment";
        el.innerHTML = `
          <div class="top">
            <div class="who">${escapeHtml(c.who)}</div>
            <div class="time">${escapeHtml(c.time || "")}</div>
          </div>
          <div class="txt">${escapeHtml(c.txt)}</div>
        `;
        postPageThread.appendChild(el);
      });
    }
  }

  function openPostPage(id){
    renderPostPage(id);
    goTo("post", { silent:true });
  }

  postBack?.addEventListener("click", () => {
    goTo("community");
  });

  postPageReact?.addEventListener("click", () => {
    if(!openPostId) return;
    const st = forumState[openPostId];
    st.liked = !st.liked;
    st.likes += st.liked ? 1 : -1;

    const countEl = $(`#plike-${openPostId}`);
    if(countEl) countEl.textContent = st.likes;
    showToast("Reacción actualizada");
  });

  postPageSend?.addEventListener("click", () => {
    if(!openPostId) return;
    const txt = (postPageInput?.value || "").trim();
    if(!txt) return;

    forumState[openPostId].comments.push({ who:"Tú", time:"Ahora", txt });
    if(postPageInput) postPageInput.value = "";

    const cEl = $(`#pc-${openPostId}`);
    if(cEl) cEl.textContent = `${forumState[openPostId].comments.length} comentarios`;

    renderPostPage(openPostId);
    showToast("Comentario añadido");
  });

  postPageInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") postPageSend?.click();
  });

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

      showToast(st.liked ? "Te gusta" : "Quitado");
      return;
    }

    const post = e.target.closest(".fPost");
    if(post){
      if(e.target.closest("[data-stop]")) return;
      openPostPage(post.dataset.postId);
    }
  });

  btnNewPost?.addEventListener("click", () => {
    showToast("Publicación en preparación");
  });

  // ---------- Centers (Valencia) ----------
  const centersQuery = $("#centersQuery");
  const centersFilters = $("#centersFilters");
  const centersList = $("#centersList");

  const centersData = [
    {
      id:"c1",
      name:"Clínica Ruzafa Salud",
      spec:"Medicina",
      zone:"Ruzafa",
      rating:4.6,
      reviews:238,
      price:"Consulta 45–60€",
      address:"C/ Sueca, Valencia",
      tags:["Cita rápida","Cercano","Seguimiento"],
      distance:"1.2 km"
    },
    {
      id:"c2",
      name:"Centro Psico Valencia",
      spec:"Psicología",
      zone:"El Carmen",
      rating:4.8,
      reviews:312,
      price:"Sesión 55–75€",
      address:"C/ Caballeros, Valencia",
      tags:["Ansiedad","Estrés","Terapia breve"],
      distance:"2.4 km"
    },
    {
      id:"c3",
      name:"Fisio Nou Moles",
      spec:"Fisioterapia",
      zone:"Nou Moles",
      rating:4.5,
      reviews:184,
      price:"Sesión 35–45€",
      address:"Av. del Cid, Valencia",
      tags:["Espalda","Cervical","Movilidad"],
      distance:"3.1 km"
    },
    {
      id:"c4",
      name:"Unidad Social Valencia",
      spec:"Trabajo Social",
      zone:"Benimaclet",
      rating:4.4,
      reviews:92,
      price:"Orientación 0–25€",
      address:"C/ Emilio Baró, Valencia",
      tags:["Recursos","Ayudas","Trámites"],
      distance:"2.0 km"
    },
    {
      id:"c5",
      name:"Consulta Médica Alameda",
      spec:"Medicina",
      zone:"Alameda",
      rating:4.7,
      reviews:145,
      price:"Consulta 50–70€",
      address:"Paseo de la Alameda, Valencia",
      tags:["Revisión","Crónicos","Analítica"],
      distance:"1.8 km"
    },
    {
      id:"c6",
      name:"PsicoCare Patraix",
      spec:"Psicología",
      zone:"Patraix",
      rating:4.6,
      reviews:204,
      price:"Sesión 50–70€",
      address:"C/ Jesús, Valencia",
      tags:["Culpa","Agotamiento","Duelo"],
      distance:"2.7 km"
    }
  ];

  let centersFilter = "all";

  function setCenterFilter(f){
    centersFilter = f;
    $$(".filterChip", centersFilters).forEach(b => b.classList.toggle("active", b.dataset.centerFilter === f));
    renderCenters();
  }

  centersFilters?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-center-filter]");
    if(!b) return;
    setCenterFilter(b.dataset.centerFilter);
  });

  centersQuery?.addEventListener("input", renderCenters);

  function renderCenters(){
    if(!centersList) return;

    const q = (centersQuery?.value || "").trim().toLowerCase();
    let list = centersData.slice();

    if(centersFilter !== "all"){
      list = list.filter(x => x.spec === centersFilter);
    }

    if(q){
      list = list.filter(x => {
        const hay = `${x.name} ${x.spec} ${x.zone} ${x.address} ${x.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    centersList.innerHTML = "";

    if(list.length === 0){
      const empty = document.createElement("div");
      empty.className = "listCard soft";
      empty.innerHTML = `
        <div class="pillTag softTag">Sin resultados</div>
        <div class="lcTitle">No encontramos centros</div>
        <div class="lcSub">Prueba con otra especialidad o palabra clave</div>
      `;
      centersList.appendChild(empty);
      return;
    }

    list.forEach(c => {
      const card = document.createElement("div");
      card.className = "centerCard";

      const badge = c.spec === "Psicología" ? "Ψ" :
                    c.spec === "Fisioterapia" ? "Fx" :
                    c.spec === "Trabajo Social" ? "TS" : "MD";

      card.innerHTML = `
        <div class="centerBadge">${badge}</div>
        <div class="centerBody">
          <div class="centerTop">
            <div style="min-width:0;">
              <div class="centerName">${escapeHtml(c.name)}</div>
              <div class="centerSpec">${escapeHtml(c.spec)} · ${escapeHtml(c.zone)} · ${escapeHtml(c.distance)}</div>
            </div>
            <button class="miniBtn" data-toast="Guardado">Guardar</button>
          </div>

          <div class="centerMeta">
            <span class="metaChip rose">${escapeHtml(c.price)}</span>
            <span class="metaChip">${escapeHtml(c.tags[0])}</span>
            <span class="metaChip">${escapeHtml(c.tags[1])}</span>
          </div>

          <div class="centerAddr">${escapeHtml(c.address)}</div>

          <div class="centerFoot">
            <div class="stars">
              <span class="starDot"></span>
              ${c.rating.toFixed(1)} <span style="opacity:.6; font-weight:900;">(${c.reviews})</span>
            </div>
            <button class="ghostBtn" data-toast="Abriendo ficha">Ver</button>
          </div>
        </div>
      `;

      centersList.appendChild(card);
    });
  }

  // ---------- Init data wiring ----------
  function resetChatInit(){
    resetChat();
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // ---------- Init ----------
  function init(){
    goTo("home");
    renderCalendar();
    renderDay();
    renderHome();
    resetChatInit();
    renderFeed();
    renderForum();
    renderCenters();
  }

  init();
})();