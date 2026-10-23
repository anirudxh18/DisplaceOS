// All entries here are illustrative demo data. Replace with verified data only when connected to a trusted source.
window.DisplaceData = {
  requests: [
    {id:"DSP-104", title:"Drinking water required", category:"Food & water", priority:"Critical", location:"Demo Camp North", people:120, details:"Sample request for packaged drinking water.", status:"Open", lat:29.22, lng:79.52, time:"10 min ago"},
    {id:"DSP-103", title:"First-aid supplies", category:"Medical", priority:"Critical", location:"Demo Relief Point", people:35, details:"Sample request for first-aid kits.", status:"Open", lat:29.20, lng:79.48, time:"18 min ago"},
    {id:"DSP-102", title:"Temporary shelter kits", category:"Shelter", priority:"High", location:"Demo Camp East", people:64, details:"Sample request for tarpaulins and blankets.", status:"In progress", lat:29.25, lng:79.55, time:"32 min ago"},
    {id:"DSP-101", title:"Food packets for families", category:"Food & water", priority:"High", location:"Demo Camp South", people:80, details:"Sample request for dry ration packets.", status:"Open", lat:29.17, lng:79.51, time:"45 min ago"},
    {id:"DSP-100", title:"Transport support", category:"Rescue", priority:"Medium", location:"Demo Staging Area", people:12, details:"Sample transport coordination request.", status:"Resolved", lat:29.24, lng:79.46, time:"1 hr ago"}
  ],
  inventory: [
    {id:"INV-01", name:"Drinking water", emoji:"💧", quantity:240, unit:"bottles", location:"Demo Camp North", target:500},
    {id:"INV-02", name:"Food packets", emoji:"🥫", quantity:680, unit:"packets", location:"Central Demo Store", target:800},
    {id:"INV-03", name:"First-aid kits", emoji:"🩹", quantity:24, unit:"kits", location:"Demo Medical Point", target:100},
    {id:"INV-04", name:"Blankets", emoji:"🛏️", quantity:95, unit:"units", location:"Demo Camp East", target:200},
    {id:"INV-05", name:"Shelter kits", emoji:"⛺", quantity:42, unit:"kits", location:"Central Demo Store", target:100}
  ],
  activities: [
    {icon:"⚑", title:"Priority request DSP-104 awaiting action", time:"10 min ago"},
    {icon:"▤", title:"Demo inventory loaded for five supply categories", time:"On startup"},
    {icon:"⌖", title:"Illustrative map locations displayed", time:"On startup"}
  ]
};
