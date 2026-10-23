(() => {
  const STORE_KEY = "displaceos-demo-v1";
  const clone = value => JSON.parse(JSON.stringify(value));
  const initial = clone(window.DisplaceData);
  let state;
  try {
    const saved = localStorage.getItem(STORE_KEY);
    state = saved ? JSON.parse(saved) : initial;
    if (!state.requests || !state.inventory || !state.activities) state = initial;
  } catch (_) { state = initial; }

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {} };
  let toastTimer;
  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  function addActivity(title, icon="✓") {
    state.activities.unshift({icon, title, time:"Just now"});
    state.activities = state.activities.slice(0, 8);
    save(); renderActivity();
  }
  const openRequests = () => state.requests.filter(r => r.status !== "Resolved");
  const criticalRequests = () => openRequests().filter(r => r.priority === "Critical");

  function renderStats() {
    $("#stat-open").textContent = String(openRequests().length).padStart(2,"0");
    $("#stat-critical").textContent = String(criticalRequests().length).padStart(2,"0");
    $("#stat-supplies").textContent = String(state.inventory.length).padStart(2,"0");
    $("#stat-resolved").textContent = String(state.requests.filter(r => r.status === "Resolved").length).padStart(2,"0");
    $("#nav-count").textContent = openRequests().length;
    $("#updated-time").textContent = "just now";
  }
  function priorityClass(priority) { return String(priority).toLowerCase(); }
  function categoryClass(category) {
    if (category === "Medical") return "medical";
    if (category === "Shelter") return "shelter";
    if (category === "Food & water") return "food";
    return "";
  }
  function renderRequests() {
    const items = [...openRequests()].sort((a,b) => {
      const rank = {Critical:0,High:1,Medium:2,Low:3};
      return rank[a.priority]-rank[b.priority];
    }).slice(0,4);
    $("#priority-list").innerHTML = items.map(r => `
      <div class="request-item">
        <div class="request-symbol ${categoryClass(r.category)}">${r.category==="Medical"?"✚":r.category==="Shelter"?"⌂":r.category==="Rescue"?"⌖":"≋"}</div>
        <div><div class="request-title">${esc(r.title)}</div><div class="request-meta">${esc(r.id)} · ${esc(r.location)}<br>${Number(r.people)||0} people affected</div>
        <select class="request-status" data-status-id="${esc(r.id)}" aria-label="Update status for ${esc(r.id)}">
          ${["Open","In progress","Resolved"].map(s=>`<option ${r.status===s?"selected":""}>${s}</option>`).join("")}
        </select></div>
        <span class="priority ${priorityClass(r.priority)}">${esc(r.priority)}</span>
      </div>`).join("") || `<p class="request-meta">No open requests. Great work!</p>`;
   
$$("[data-status-id]").forEach(select => {
  select.addEventListener("change", async e => {
    const request = state.requests.find(
      r => r.id === e.target.dataset.statusId
    );

    if (!request) return;

    // Demo-only records still use local state.
    if (!request.dbId) {
      request.status = e.target.value;
      save();
      renderAll();
      toast("Demo request updated locally.");
      return;
    }

    const client = window.displaceSupabase;
    const { data, error } = await client
      .from("incidents")
      .update({ status: e.target.value })
      .eq("id", request.dbId)
      .select("id, status")
      .maybeSingle();

    if (error || !data) {
      console.error("Status update failed:", error);
      e.target.value = request.status;
      toast(
        error
          ? "Status update failed: " + error.message
          : "Update denied. Check your account permissions."
      );
      return;
    }

    request.status = data.status;
    save();
    renderAll();
    toast("Incident status saved to Supabase.");
  });
});

  }
  function renderInventory() {
    $("#inventory-preview").innerHTML = state.inventory.slice(0,6).map(item => {
      const pct = Math.max(0,Math.min(100,Math.round((Number(item.quantity)||0)/(Number(item.target)||1)*100)));
      return `<div class="stock-item"><div class="stock-top"><span><span class="stock-emoji">${esc(item.emoji)}</span>${esc(item.name)}</span></div>
        <div class="stock-qty">${Number(item.quantity)||0} <small>${esc(item.unit)}</small></div>
        <div class="stock-bar"><span class="${pct<30?"low-stock":""}" style="width:${pct}%"></span></div>
        <div class="stock-note">${esc(item.location)} · ${pct}% of target</div></div>`;
    }).join("");
  }
  function renderActivity() {
    $("#activity-list").innerHTML = state.activities.slice(0,4).map(a => `<div class="activity-item"><div class="activity-icon">${esc(a.icon)}</div><div><strong>${esc(a.title)}</strong><small>${esc(a.time)}</small></div></div>`).join("");
    $("#activity-count").textContent = `${state.activities.length} events`;
  }
  function renderAll() { renderStats(); renderRequests(); renderInventory(); renderActivity(); }

  async function loadIncidentsFromSupabase() {
    const client = window.displaceSupabase;
    if (!client) return;

    const { data, error } = await client
      .from("incidents")
      .select(
        "id, title, category, priority, location, people_affected, details, status, latitude, longitude, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load incidents:", error.message);
      toast("Could not load database incidents: " + error.message);
      return;
    }

    const dbRequests = (data || []).map(row => ({
      id: "DSP-" + String(row.id).slice(0, 8),
      dbId: row.id,
      title: row.title,
      category: row.category,
      priority: row.priority,
      location: row.location,
      people: Number(row.people_affected) || 0,
      details: row.details || "",
      status: row.status || "Open",
      lat: Number(row.latitude) || 29.22,
      lng: Number(row.longitude) || 79.51,
      time: row.created_at
        ? new Date(row.created_at).toLocaleString()
        : ""
    }));

    // Keep local demo records that do not originate from the database.
    const localOnly = state.requests.filter(r => !r.dbId);

    state.requests = [...dbRequests, ...localOnly];
    renderAll();
  }

  let map;
  function initMap() {
    if (!window.L || !$("#map")) {
      $("#map").innerHTML = '<div style="padding:20px;color:#566277">Map needs an internet connection to load Leaflet and map tiles.</div>'; return;
    }
    map = L.map("map", {scrollWheelZoom:false}).setView([29.22,79.51], 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
    }).addTo(map);
    const addPin = (lat,lng,color,title,description) => {
      const marker = L.circleMarker([lat,lng], {radius:8,fillColor:color,color:"#fff",weight:2,opacity:1,fillOpacity:.95}).addTo(map);
      marker.bindPopup(`<strong>${esc(title)}</strong><br>${esc(description)}<br><small>Illustrative demo location</small>`);
    };
    state.requests.forEach(r => addPin(r.lat || 29.22, r.lng || 79.51, r.status==="Resolved"?"#1baf87":r.priority==="Critical"?"#ef5a48":"#e9a23b",r.title,`${r.id} · ${r.location}`));
    addPin(29.19,79.54,"#1baf87","Demo Relief Camp","Illustrative camp marker");
    addPin(29.26,79.47,"#557df2","Demo Response Team","Illustrative response-team marker");
    $("#reset-map").addEventListener("click", () => map.setView([29.22,79.51],11));
  }

  const viewDetails = {
    overview:["Situation overview","A shared operational picture for faster, more coordinated relief."],
    incidents:["Incident requests","Review incoming needs, prioritize incidents and update response status."],
    inventory:["Relief inventory","Track quantities across sample camps and adjust stock during the demo."],
    coordination:["Field coordination","Illustrative map locations and request details for coordination discussions."]
  };
  function showView(view) {
    const details = viewDetails[view] || viewDetails.overview;
    $("#page-label").textContent = details[0]; $("#heading").textContent = details[0]; $("#subheading").textContent = details[1];
    $$(".nav-link").forEach(b => b.classList.toggle("active",b.dataset.view===view));
    const full = $("#full-view");
    if (view==="overview") { full.classList.add("hidden"); $("#map-section").classList.remove("hidden"); $(".requests-panel").classList.remove("hidden"); $(".bottom-grid").classList.remove("hidden"); }
    else {
      full.classList.remove("hidden");
      $("#map-section").classList.toggle("hidden",view!=="coordination");
      $(".requests-panel").classList.toggle("hidden",view==="inventory"||view==="coordination");
      $(".bottom-grid").classList.toggle("hidden",view==="incidents"||view==="coordination");
      if(view==="incidents") renderIncidentTable(full);
      if(view==="inventory") renderInventoryTable(full);
      if(view==="coordination") {
        full.innerHTML = `<h2>Field coordination board</h2><p class="view-intro">All pins and records below are illustrative demo data. Use the map above to inspect locations.</p><div class="table-wrap"><table><thead><tr><th>Reference</th><th>Request / location</th><th>Priority</th><th>People affected</th><th>Status</th></tr></thead><tbody>${state.requests.map(r=>`<tr><td>${esc(r.id)}</td><td><strong>${esc(r.title)}</strong><br>${esc(r.location)}</td><td><span class="priority ${priorityClass(r.priority)}">${esc(r.priority)}</span></td><td>${Number(r.people)||0}</td><td>${esc(r.status)}</td></tr>`).join("")}</tbody></table></div>`;
        setTimeout(()=>map && map.invalidateSize(),100);
      }
    }
    if(view==="overview"){ setTimeout(()=>map && map.invalidateSize(),100); }
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderIncidentTable(target) {
    target.innerHTML = `<h2>All incident requests</h2><p class="view-intro">Change a request status directly in the table. Sample data is saved only in this browser.</p><div class="table-wrap"><table><thead><tr><th>Reference</th><th>Request</th><th>Priority</th><th>Location</th><th>People</th><th>Status</th></tr></thead><tbody>${state.requests.map(r=>`<tr><td>${esc(r.id)}</td><td><strong>${esc(r.title)}</strong><br>${esc(r.category)}</td><td><span class="priority ${priorityClass(r.priority)}">${esc(r.priority)}</span></td><td>${esc(r.location)}</td><td>${Number(r.people)||0}</td><td><select class="inline-control" data-status-id="${esc(r.id)}">${["Open","In progress","Resolved"].map(s=>`<option ${r.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>`;
   
target.querySelectorAll("[data-adjust]").forEach(button => {
  button.addEventListener("click", async e => {
    const item = state.inventory.find(
      i => i.id === e.currentTarget.dataset.adjust
    );

    if (!item) return;

    const delta = Number(e.currentTarget.dataset.delta);

    // Demo inventory items are not database records.
    if (!item.dbId) {
      toast("This is demo inventory. Database stock was not changed.");
      return;
    }

    const client = window.displaceSupabase;
    const newQuantity = Math.max(
      0,
      Number(item.quantity || 0) + delta
    );

    const { data, error } = await client
      .from("inventory")
      .update({ quantity: newQuantity })
      .eq("id", item.dbId)
      .select("id, quantity")
      .maybeSingle();

    if (error || !data) {
      console.error("Inventory update failed:", error);
      toast(
        error
          ? "Inventory update failed: " + error.message
          : "Update denied. Check your account permissions."
      );
      return;
    }

    item.quantity = Number(data.quantity);
    addActivity(`${item.name} stock updated to ${item.quantity} ${item.unit}`, "▤");
    save();
    renderAll();
    renderInventoryTable(target);
    toast("Inventory stock saved to Supabase.");
  });
});

  }
  function renderInventoryTable(target) {
    target.innerHTML = `<h2>Inventory management</h2><p class="view-intro">Use + and − to simulate stock changes. A real deployment needs authenticated users and server-side validation.</p><div class="table-wrap"><table><thead><tr><th>Supply</th><th>Location</th><th>Available stock</th><th>Target</th><th>Adjust quantity</th></tr></thead><tbody>${state.inventory.map(i=>`<tr><td><strong>${esc(i.emoji)} ${esc(i.name)}</strong></td><td>${esc(i.location)}</td><td>${Number(i.quantity)||0} ${esc(i.unit)}</td><td>${Number(i.target)||0}</td><td><div class="stock-edit"><button data-adjust="${esc(i.id)}" data-delta="-10" aria-label="Reduce ${esc(i.name)}">−</button><button data-adjust="${esc(i.id)}" data-delta="10" aria-label="Increase ${esc(i.name)}">+</button></div></td></tr>`).join("")}</tbody></table></div>`;
    target.querySelectorAll("[data-adjust]").forEach(b=>b.addEventListener("click",e=>{
      const item=state.inventory.find(i=>i.id===e.currentTarget.dataset.adjust); if(!item)return;
      item.quantity=Math.max(0,(Number(item.quantity)||0)+Number(e.currentTarget.dataset.delta));
      addActivity(`${item.name} stock updated to ${item.quantity} ${item.unit}`,"▤"); save(); renderAll(); renderInventoryTable(target); toast("Inventory updated.");
    }));
  }

  const dialog = $("#request-dialog");
  function openDialog(){ if(typeof dialog.showModal==="function")dialog.showModal(); else dialog.setAttribute("open",""); }
  function closeDialog(){ if(typeof dialog.close==="function")dialog.close(); else dialog.removeAttribute("open"); }
  $("#new-request-btn").addEventListener("click",openDialog);
  $("#close-dialog").addEventListener("click",closeDialog);
  $("#cancel-dialog").addEventListener("click",closeDialog);
 
  $("#request-form").addEventListener("submit", async e => {
    e.preventDefault();

    const client = window.displaceSupabase;

    if (!client) {
      toast("Database connection is unavailable.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const location = String(form.get("location") || "").trim();

    if (!title || !location) {
      toast("Please complete the required fields.");
      return;
    }

    const submitButton = e.currentTarget.querySelector(
      '[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const { data: userData, error: userError } =
        await client.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("Please sign in before submitting a request.");
      }

      const { data: row, error } = await client
        .from("incidents")
        .insert({
          title,
          category: String(form.get("category") || "Other"),
          priority: String(form.get("priority") || "Medium"),
          location,
          people_affected: Math.max(
            1,
            Number(form.get("people")) || 1
          ),
          details: String(form.get("details") || ""),
          status: "Open",
          reported_by: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      const request = {
        id: "DSP-" + String(row.id).slice(0, 8),
        dbId: row.id,
        title: row.title,
        category: row.category,
        priority: row.priority,
        location: row.location,
        people: Number(row.people_affected) || 0,
        details: row.details || "",
        status: row.status,
        lat: Number(row.latitude) || 29.22,
        lng: Number(row.longitude) || 79.51,
        time: "Just now"
      };

      state.requests = [
        request,
        ...state.requests.filter(r => r.dbId !== row.id)
      ];

      addActivity("New request " + request.id + " saved to database", "✓");
      renderAll();

      if (map) {
        const marker = L.circleMarker(
          [request.lat, request.lng],
          {
            radius: 8,
            fillColor: request.priority === "Critical"
              ? "#ef5a48"
              : "#e9a23b",
            color: "#fff",
            weight: 2,
            fillOpacity: 1
          }
        ).addTo(map);

        marker.bindPopup(
          `<strong>${esc(request.title)}</strong><br>${esc(request.location)}`
        );
      }

    const requestForm = document.querySelector("#request-form");
if (requestForm) requestForm.reset();

closeDialog();
showView("overview");
toast("Request saved successfully to Supabase.");

      await loadIncidentsFromSupabase();

    } catch (error) {
      console.error("Incident submission failed:", error);
      toast("Could not save request: " + error.message);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  $$(".nav-link,[data-view]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.view)));
  $("#dismiss-alert").addEventListener("click",()=>$(".alert-banner").remove());
  $("#export-btn").addEventListener("click",()=>{
    const payload={exportedAt:new Date().toISOString(),notice:"Illustrative demo data only; not verified emergency information.",...state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="displaceos-demo-report.json";a.click();URL.revokeObjectURL(url);toast("Demo report exported.");
  });
  renderAll();
initMap();
loadIncidentsFromSupabase();

async function loadInventoryFromSupabase() {
  const client = window.displaceSupabase;
  if (!client) return;

  const { data, error } = await client
    .from("inventory")
    .select("id, name, quantity, unit, location, target_quantity, updated_at")
    .order("name");

  if (error) {
    console.error("Inventory load failed:", error.message);
    toast("Could not load inventory: " + error.message);
    return;
  }

  state.inventory = (data || []).map(row => ({
    id: row.id,
    dbId: row.id,
    name: row.name,
    quantity: Number(row.quantity) || 0,
    unit: row.unit || "units",
    location: row.location || "Unspecified",
    target: Number(row.target_quantity) || 1,
    emoji: /water/i.test(row.name) ? "💧"
      : /food/i.test(row.name) ? "🍱"
      : /medical|first aid/i.test(row.name) ? "🩺"
      : /blanket/i.test(row.name) ? "🛏️"
      : "📦"
  }));

  renderAll();
}


})(); 

