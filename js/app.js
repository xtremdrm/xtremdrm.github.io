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
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
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

  // ---------- Quick sheet ----------
  const btnQuick = $("#btnQuick");
  const sheet = $("#sheet");
  const sheetBackdrop = $("#sheetBackdrop");

  function openSheet(){
    sheet?.classList.add("open");
    sheetBackdrop?.classList.add("open");
  }
  function closeSheet(){
    sheet?.classList.remove("open");
    sheetBackdrop?.classList.remove("open");
  }
  btnQuick?.addEventListener("click", openSheet);
  sheetBackdrop?.addEventListener("click", closeSheet);

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
    closeSheet();

    const active = pages.find(p => p.dataset.page === name);
    if(active) active.scrollTo({top:0, behavior:"smooth"});

    // when entering feed, ensure the first video plays
    if(name === "feed") {
      setTimeout(() => autoPlayVisibleFeedVideo(), 60);
    }
  }

  document.addEventListener("click", (e) => {
    const n = e.target.closest("[data-nav]");
    if(!n) return;
    goTo(n.dataset.nav);
  });

  // ---------- Calendar ----------
  const calGrid = $("#calGrid");
  const calTitle = $("#calTitle");
  const dayTitle = $("#dayTitle");
  const dayEvents = $("#dayEvents");
  const calPrev = $("#calPrev");
  const calNext = $("#calNext");
  const btnAddDemo = $("#btnAddDemo");

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // Datos demo: por fecha YYYY-MM-DD
  const schedule = {
    "2026-02-24": [
      { type:"med", title:"Paracetamol 1g", time:"12:00", note:"Después de comer" },
      { type:"appt", title:"Fisioterapia", time:"18:30", note:"Clínica Centro" }
    ],
    "2026-02-25": [
      { type:"med", title:"Vitamina D", time:"09:00", note:"Con desayuno" }
    ],
    "2026-02-28": [
      { type:"appt", title:"Médico de familia", time:"10:15", note:"Revisión" },
      { type:"med", title:"Ibuprofeno", time:"21:30", note:"Si dolor" }
    ]
  };

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-11
  let selectedDate = new Date(viewYear, viewMonth, today.getDate());

  function ymd(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const da = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${da}`;
  }

  function hasEventsFor(d){
    return (schedule[ymd(d)] || []).length > 0;
  }

  // Week start Monday
  function mondayIndex(jsDay){ // js: 0 Sun..6 Sat => 0 Mon..6 Sun
    return (jsDay + 6) % 7;
  }

  function renderCalendar(){
    if(!calGrid || !calTitle) return;

    calTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    calGrid.innerHTML = "";

    const first = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    const startPad = mondayIndex(first.getDay());

    // previous month days to fill
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    // 42 cells (6 weeks)
    for(let i=0; i<42; i++){
      const cell = document.createElement("button");
      cell.className = "dayCell";
      let dayNum, cellDate, muted = false;

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
      cell.textContent = String(dayNum);

      if(ymd(cellDate) === ymd(selectedDate)) cell.classList.add("selected");

      if(hasEventsFor(cellDate)){
        const dot = document.createElement("span");
        dot.className = "dot";
        cell.appendChild(dot);
      }

      cell.addEventListener("click", () => {
        // If user clicks muted day, jump to that month
        viewYear = cellDate.getFullYear();
        viewMonth = cellDate.getMonth();
        selectedDate = cellDate;
        renderCalendar();
        renderDayEvents();
      });

      calGrid.appendChild(cell);
    }
  }

  function renderDayEvents(){
    if(!dayTitle || !dayEvents) return;
    const d = selectedDate;
    const pretty = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    dayTitle.textContent = `Eventos · ${pretty}`;

    const items = schedule[ymd(d)] || [];
    dayEvents.innerHTML = "";

    if(items.length === 0){
      const empty = document.createElement("div");
      empty.className = "listCard soft";
      empty.innerHTML = `
        <div class="pillTag softTag">Tranquilo</div>
        <div class="lcTitle">No hay eventos este día</div>
        <div class="lcSub">Añade citas/medicación (demo)</div>
      `;
      dayEvents.appendChild(empty);
      return;
    }

    items
      .slice()
      .sort((a,b)=>a.time.localeCompare(b.time))
      .forEach(ev => {
        const card = document.createElement("div");
        card.className = "listCard";
        const tagClass = ev.type === "med" ? "pink" : "rose";
        const tagText  = ev.type === "med" ? "Medicación" : "Cita";
        card.innerHTML = `
          <div class="pillTag ${tagClass}">${tagText}</div>
          <div class="lcTitle">${ev.title}</div>
          <div class="lcSub">${ev.time} · ${ev.note || ""}</div>
          <button class="miniBtn" data-toast="Acción demo">OK</button>
        `;
        dayEvents.appendChild(card);
      });
  }

  calPrev?.addEventListener("click", () => {
    const d = new Date(viewYear, viewMonth-1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    // keep selected day within month range
    selectedDate = new Date(viewYear, viewMonth, 1);
    renderCalendar();
    renderDayEvents();
  });

  calNext?.addEventListener("click", () => {
    const d = new Date(viewYear, viewMonth+1, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    selectedDate = new Date(viewYear, viewMonth, 1);
    renderCalendar();
    renderDayEvents();
  });

  btnAddDemo?.addEventListener("click", () => {
    const key = ymd(selectedDate);
    schedule[key] = schedule[key] || [];
    schedule[key].push({
      type: Math.random() > 0.5 ? "med" : "appt",
      title: Math.random() > 0.5 ? "Medicamento (demo)" : "Cita (demo)",
      time: Math.random() > 0.5 ? "09:30" : "17:45",
      note: "Añadido desde demo"
    });
    showToast("Añadido (demo)");
    renderCalendar();
    renderDayEvents();
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
    if(chatHint) chatHint.textContent = `Conectado con ${name} (demo).`;
    addBubble(`Hola, soy ${name}. Cuéntame tu duda y te doy una pauta breve.`, "pro");
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-specialist]");
    if(!c) return;
    setSpecialist(c.dataset.specialist);
  });

  function botReply(userText){
    const base = [
      "Gracias. Dame: 1) desde cuándo 2) intensidad 3) qué lo mejora/empeora.",
      "Entiendo. ¿Hay algún síntoma asociado (mareo, fiebre, dolor, ansiedad)?",
      "Pauta breve (demo): prioriza seguridad, pausa 2 min, y divide en pasos."
    ];
    const msg = `${activeSpecialist ? `(${activeSpecialist}) ` : ""}${base[Math.floor(Math.random()*base.length)]}`;
    setTimeout(() => addBubble(msg, "pro"), 450);
  }

  function sendChatMsg(){
    const t = (chatInput?.value || "").trim();
    if(!t) return;
    if(!activeSpecialist){
      showToast("Elige especialidad primero");
      return;
    }
    addBubble(t, "me");
    if(chatInput) chatInput.value = "";
    botReply(t);
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
    addBubble("Bienvenido/a a la demo. Selecciona especialidad arriba.", "pro");
  }
  btnChatReset?.addEventListener("click", () => {
    resetChat();
    showToast("Chat restablecido");
  });

  // ---------- Feed (TikTok-style) ----------
  const feedContainer = $("#feedContainer");
  const drawer = $("#drawer");
  const drawerBackdrop = $("#drawerBackdrop");
  const drawerBody = $("#drawerBody");
  const drawerClose = $("#drawerClose");
  const drawerSend = $("#drawerSend");
  const drawerInput = $("#drawerInput");

  // SOLO tienes que meter videos en /assets/videos/ con estos nombres (o cambia el array)
  const feedData = [
    {
      id: "v1",
      src: "assets/videos/demo1.mp4",
      title: "Mindfulness en 60s",
      sub: "Respira · 4-4-6 · baja tensión mental"
    },
    {
      id: "v2",
      src: "assets/videos/demo2.mp4",
      title: "Movilización segura",
      sub: "Espalda neutra · apoyo · no tirar del brazo"
    },
    {
      id: "v3",
      src: "assets/videos/demo3.mp4",
      title: "Rutina corta de estiramiento",
      sub: "2 min · cuello y hombros · reduce carga"
    }
  ];

  const feedState = {}; // { [id]: { likes, liked, comments: [] } }
  feedData.forEach(v => {
    feedState[v.id] = {
      likes: Math.floor(20 + Math.random()*120),
      liked: false,
      comments: [
        { who: "Ana", txt: "Esto me viene perfecto para el día a día." },
        { who: "Marco", txt: "Muy útil lo de dividir en pasos." },
        { who: "Lola", txt: "¿Puedes hacer uno sobre descanso y culpa?" }
      ]
    };
  });

  function renderFeed(){
    if(!feedContainer) return;
    feedContainer.innerHTML = "";

    feedData.forEach(v => {
      const st = feedState[v.id];

      const item = document.createElement("section");
      item.className = "feedItem";
      item.dataset.feedId = v.id;

      item.innerHTML = `
        <video class="feedVideo" src="${v.src}" playsinline muted loop></video>
        <div class="feedOverlay"></div>

        <div class="feedMeta">
          <div class="title">${v.title}</div>
          <div class="sub">${v.sub}</div>
        </div>

        <div class="feedActions">
          <div class="fabWrap">
            <button class="fab ${st.liked ? "liked":""}" data-like="${v.id}" aria-label="Like">
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
            <button class="fab" data-toast="Guardado (demo)" aria-label="Guardar">
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

    // play first visible
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
      const score = visible; // bigger = more visible
      if(score > bestScore){
        bestScore = score;
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

  // Like + comments
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
      const id = comBtn.dataset.comments;
      openComments(id);
      return;
    }
  });

  let currentCommentsId = null;

  function openComments(id){
    currentCommentsId = id;
    drawerBackdrop?.classList.add("open");
    drawer?.classList.add("open");
    renderComments(id);
  }
  function closeComments(){
    drawerBackdrop?.classList.remove("open");
    drawer?.classList.remove("open");
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
    showToast("Comentado");
  });

  drawerInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") drawerSend?.click();
  });

  // ---------- Community (Reddit-ish) ----------
  const redditList = $("#redditList");
  const btnNewPost = $("#btnNewPost");
  const postBackdrop = $("#postBackdrop");
  const postModal = $("#postModal");
  const postClose = $("#postClose");
  const pmTitle = $("#pmTitle");
  const pmBody = $("#pmBody");
  const pmSend = $("#pmSend");
  const pmInput = $("#pmInput");

  const redditData = [
    {
      id: "p1",
      community: "r/cuidadores",
      user: "u/cansadito19",
      time: "hace 2 h",
      title: "¿Cómo gestionáis el cansancio mental sin sentir culpa?",
      text: "Llevo meses cuidando y hay días que no puedo más. ¿Algún método realista para aguantar sin reventar?",
      votes: 127,
      comments: [
        { who:"u/respira_fuerte", time:"hace 1 h", txt:"Bloques de 15 min + micro descansos. Y pedir relevo sin negociar con la culpa." },
        { who:"u/fisio_pro", time:"hace 55 min", txt:"Si hay carga física, el cansancio mental se multiplica. Ajusta rutinas, simplifica y protege espalda." },
        { who:"u_trabajo_social", time:"hace 30 min", txt:"Mira recursos de respiro familiar en tu zona. No es un lujo, es supervivencia." }
      ]
    },
    {
      id: "p2",
      community: "r/cuidadores",
      user: "u/valencia_help",
      time: "ayer",
      title: "Recursos en Valencia: ¿asociaciones que valgan la pena?",
      text: "Busco asociaciones o grupos de apoyo. Si tenéis nombres o experiencias, se agradece.",
      votes: 63,
      comments: [
        { who:"u/ana_m", time:"ayer", txt:"A mí me ayudó ir a un centro de día 2 mañanas. No es barato pero te salva." },
        { who:"u/marco_s", time:"ayer", txt:"Pregunta en tu centro de salud por trabajador/a social, te orientan bien." }
      ]
    }
  ];

  const redditState = {};
  redditData.forEach(p => {
    redditState[p.id] = { votes: p.votes, userVote: 0, comments: [...p.comments] };
  });

  function renderReddit(){
    if(!redditList) return;
    redditList.innerHTML = "";

    redditData.forEach(p => {
      const st = redditState[p.id];

      const row = document.createElement("article");
      row.className = "rPost";
      row.dataset.postId = p.id;

      row.innerHTML = `
        <div class="voteCol" data-stop>
          <button class="voteBtn" data-up="${p.id}" aria-label="Upvote">
            <svg viewBox="0 0 24 24"><path d="M12 7l7 8H5l7-8z"/></svg>
          </button>
          <div class="voteCount" id="vote-${p.id}">${st.votes}</div>
          <button class="voteBtn" data-down="${p.id}" aria-label="Downvote">
            <svg viewBox="0 0 24 24"><path d="M12 17l-7-8h14l-7 8z"/></svg>
          </button>
        </div>

        <div class="rBody">
          <div class="rMeta">${p.community} · ${p.user} · ${p.time}</div>
          <div class="rTitle">${p.title}</div>
          <div class="rText">${p.text}</div>
          <div class="rFooter">
            <svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
            <span id="c-${p.id}">${st.comments.length} comentarios</span>
          </div>
        </div>
      `;

      redditList.appendChild(row);
    });
  }

  document.addEventListener("click", (e) => {
    // votes
    const up = e.target.closest("[data-up]");
    const down = e.target.closest("[data-down]");

    if(up || down){
      const id = (up || down).dataset.up || (up || down).dataset.down;
      const st = redditState[id];
      if(!st) return;

      const dir = up ? 1 : -1;
      // toggle logic:
      // if same vote already, remove
      if(st.userVote === dir){
        st.votes -= dir;
        st.userVote = 0;
      } else {
        // if switching, remove previous then add new
        st.votes += dir - st.userVote;
        st.userVote = dir;
      }
      const vEl = $(`#vote-${id}`);
      if(vEl) vEl.textContent = st.votes;
      return;
    }

    // open post
    const post = e.target.closest(".rPost");
    if(post){
      // avoid opening when clicking vote column
      if(e.target.closest("[data-stop]")) return;
      openPost(post.dataset.postId);
    }
  });

  function openPost(id){
    const p = redditData.find(x => x.id === id);
    const st = redditState[id];
    if(!p || !st) return;

    pmTitle.textContent = p.title;

    pmBody.innerHTML = `
      <div class="listCard" style="margin-bottom:10px;">
        <div class="pillTag rose">${p.community}</div>
        <div class="lcTitle">${p.title}</div>
        <div class="lcSub">${p.user} · ${p.time}</div>
        <div class="lcSub" style="margin-top:10px; color: rgba(31,27,36,.74);">${p.text}</div>
      </div>

      <div class="thread" id="thread"></div>
    `;

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
  }

  function closePost(){
    postBackdrop.classList.remove("open");
    postModal.classList.remove("open");
    postModal.dataset.openId = "";
  }

  postBackdrop?.addEventListener("click", closePost);
  postClose?.addEventListener("click", closePost);

  pmSend?.addEventListener("click", () => {
    const id = postModal.dataset.openId;
    if(!id) return;

    const txt = (pmInput?.value || "").trim();
    if(!txt) return;

    redditState[id].comments.push({ who:"u/tu", time:"ahora", txt });
    if(pmInput) pmInput.value = "";

    // re-open to re-render thread quickly
    openPost(id);

    const cEl = $(`#c-${id}`);
    if(cEl) cEl.textContent = `${redditState[id].comments.length} comentarios`;
    showToast("Comentario añadido");
  });

  pmInput?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") pmSend?.click();
  });

  btnNewPost?.addEventListener("click", () => {
    showToast("Crear post: pendiente (demo)");
  });

  // ---------- Init ----------
  function init(){
    // Default page
    goTo("home");

    // Calendar init
    renderCalendar();
    renderDayEvents();

    // Chat init
    resetChat();

    // Feed init
    renderFeed();

    // Community init
    renderReddit();
  }

  init();
})();