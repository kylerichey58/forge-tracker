import { useState, useEffect } from "react";

// ─── Meal Plan Data ───────────────────────────────────────────────────────────
const DEFAULT_DAILY_MEALS = {
  Monday: {
    morning:   { meal:"3 scrambled eggs + 1 cup Greek yogurt (plain)",                       calories:380, protein:42, carbs:22, fat:14, fiber:1 },
    midMorning:{ meal:"Protein shake + handful of almonds",                                   calories:280, protein:30, carbs:14, fat:10, fiber:2 },
    lunch:     { meal:"Grilled chicken breast (6oz) over large salad with olive oil & lemon", calories:420, protein:52, carbs:12, fat:14, fiber:4 },
    snack:     { meal:"Hard boiled eggs x2 + cucumber slices",                                calories:180, protein:14, carbs:4,  fat:10, fiber:1 },
    dinner:    { meal:"Shrimp stir fry with white rice (1 cup) & mixed veggies",              calories:520, protein:44, carbs:52, fat:10, fiber:5 },
  },
  Tuesday: {
    morning:   { meal:"Egg white omelette (4 whites, 1 whole) + salsa",                      calories:220, protein:28, carbs:6,  fat:6,  fiber:1 },
    midMorning:{ meal:"Greek yogurt (plain) + berries",                                       calories:200, protein:18, carbs:22, fat:2,  fiber:2 },
    lunch:     { meal:"Chicken breast (6oz) + baked potato (medium) + side salad",           calories:480, protein:50, carbs:44, fat:8,  fiber:5 },
    snack:     { meal:"Beef jerky (2oz) + apple",                                             calories:220, protein:22, carbs:24, fat:4,  fiber:4 },
    dinner:    { meal:"Sashimi platter (salmon/tuna 8pc) + miso soup + side salad",           calories:480, protein:46, carbs:18, fat:16, fiber:3 },
  },
  Wednesday: {
    morning:   { meal:"3 whole eggs scrambled + 2 slices turkey bacon",                      calories:340, protein:34, carbs:4,  fat:20, fiber:0 },
    midMorning:{ meal:"Protein shake (water based)",                                          calories:180, protein:30, carbs:8,  fat:3,  fiber:1 },
    lunch:     { meal:"Shrimp salad (large) with avocado & lemon dressing",                  calories:400, protein:42, carbs:14, fat:18, fiber:6 },
    snack:     { meal:"Cottage cheese (1 cup) + pineapple chunks",                            calories:220, protein:24, carbs:22, fat:4,  fiber:1 },
    dinner:    { meal:"Grilled chicken thighs (2, skinless) + roasted potatoes + broccoli",  calories:560, protein:52, carbs:42, fat:16, fiber:6 },
  },
  Thursday: {
    morning:   { meal:"Egg & veggie scramble (3 eggs, peppers, onions, spinach)",             calories:300, protein:26, carbs:14, fat:16, fiber:4 },
    midMorning:{ meal:"Protein bar (20g+ protein) + water",                                   calories:240, protein:22, carbs:26, fat:8,  fiber:3 },
    lunch:     { meal:"Grilled chicken (6oz) + white rice (3/4 cup) + cucumber salad",       calories:460, protein:50, carbs:40, fat:8,  fiber:3 },
    snack:     { meal:"Hard boiled eggs x2 + string cheese",                                  calories:230, protein:20, carbs:2,  fat:14, fiber:0 },
    dinner:    { meal:"Shrimp tacos (corn tortillas x2) + cabbage slaw + salsa",              calories:480, protein:40, carbs:44, fat:14, fiber:5 },
  },
  Friday: {
    morning:   { meal:"3 egg omelette with spinach & mushrooms",                              calories:280, protein:26, carbs:6,  fat:16, fiber:2 },
    midMorning:{ meal:"Greek yogurt + protein shake",                                         calories:340, protein:46, carbs:24, fat:6,  fiber:1 },
    lunch:     { meal:"Sushi bowl — sashimi over rice, cucumber, avocado, soy sauce",         calories:500, protein:44, carbs:48, fat:14, fiber:4 },
    snack:     { meal:"Beef jerky (1.5oz) + mixed nuts (small handful)",                      calories:240, protein:18, carbs:12, fat:14, fiber:2 },
    dinner:    { meal:"Grilled chicken breast (6oz) + large salad + olive oil dressing",      calories:420, protein:52, carbs:10, fat:16, fiber:4 },
  },
};

const BEER_TYPES = [
  { name:"Light Beer",    emoji:"🍺", calories:95,  carbs:3,  alcohol:"4.2%", eg:"Michelob Ultra, Bud Light" },
  { name:"Regular Beer",  emoji:"🍺", calories:153, carbs:13, alcohol:"5%",   eg:"Budweiser, Coors" },
  { name:"IPA",           emoji:"🍻", calories:200, carbs:18, alcohol:"6.5%", eg:"Dogfish Head, Stone IPA" },
  { name:"Craft / Stout", emoji:"🍺", calories:220, carbs:20, alcohol:"7%",   eg:"Guinness, craft darks" },
  { name:"Hard Seltzer",  emoji:"🥤", calories:100, carbs:2,  alcohol:"5%",   eg:"White Claw, Truly" },
  { name:"Hard Cider",    emoji:"🍎", calories:190, carbs:24, alcohol:"5%",   eg:"Angry Orchard, Strongbow" },
];

const BAD_CAL_PRESETS = [
  { name:"French Fries",      emoji:"🍟", calories:365, carbs:48, fat:17 },
  { name:"Slice of Pizza",    emoji:"🍕", calories:285, carbs:36, fat:10 },
  { name:"Burger",            emoji:"🍔", calories:540, carbs:40, fat:28 },
  { name:"Chips (bag)",       emoji:"🥔", calories:160, carbs:15, fat:10 },
  { name:"Ice Cream (scoop)", emoji:"🍦", calories:250, carbs:30, fat:13 },
  { name:"Cookies (2)",       emoji:"🍪", calories:200, carbs:28, fat:9  },
  { name:"Brownie",           emoji:"🍫", calories:240, carbs:32, fat:12 },
  { name:"Candy Bar",         emoji:"🍬", calories:220, carbs:30, fat:11 },
  { name:"Nachos",            emoji:"🧀", calories:430, carbs:42, fat:24 },
  { name:"Mozzarella Sticks", emoji:"🧀", calories:310, carbs:26, fat:17 },
  { name:"Late Night Snack",  emoji:"🌙", calories:300, carbs:30, fat:12 },
  { name:"Donut",             emoji:"🍩", calories:270, carbs:30, fat:15 },
];

const WATER_QUICK_ADD = [8, 12, 16, 20];
const MEAL_TYPES = ["Breakfast","Mid-Morning","Lunch","Snack","Dinner","Post-Workout","Late Night"];
const DAYS       = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const WEEKEND_MSG = "Weekend — freestyle meals. Aim for high protein, stay mindful. You've got this.";
const MC = { calories:"#e8ff47", protein:"#7fff6e", carbs:"#60a5fa", fat:"#f97316", fiber:"#c084fc" };

// ─── localStorage helpers ─────────────────────────────────────────────────────
const storage = {
  get: (key) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
  delete: (key) => {
    try { localStorage.removeItem(key); return true; } catch { return false; }
  },
};

function getTodayName() {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
}
function getTodayKey() { return new Date().toISOString().split("T")[0]; }

const IS = { width:"100%", marginTop:6, background:"#1a1a2e", border:"1px solid #2a2a4a", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:14, boxSizing:"border-box" };
const LS = { fontSize:11, color:"#666", letterSpacing:1, textTransform:"uppercase" };

// ─── ONBOARDING SCREEN ────────────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "", age: "", gender: "",
    startWeight: "", goalWeight: "",
    dailyCalories: "", dailyProtein: "",
  });

  const steps = [
    {
      title: "Welcome to FORGE",
      subtitle: "Your personal fitness & nutrition tracker. Let's get you set up.",
      emoji: "⚡",
      fields: (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={LS}>Your Name</label>
            <input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}
              placeholder="First name" style={{...IS,fontSize:18,padding:"14px 16px"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={LS}>Age</label>
              <input type="number" value={profile.age} onChange={e=>setProfile({...profile,age:e.target.value})}
                placeholder="e.g. 30" style={IS}/>
            </div>
            <div>
              <label style={LS}>Gender</label>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {["Male","Female","Other"].map(g=>(
                  <button key={g} onClick={()=>setProfile({...profile,gender:g})} style={{
                    flex:1,padding:"10px 6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,
                    fontWeight:600,background:profile.gender===g?"#e8ff47":"#1a1a2e",
                    color:profile.gender===g?"#0a0a0a":"#888",fontFamily:"'Oswald',sans-serif",letterSpacing:1
                  }}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      valid: profile.name.trim().length > 0,
    },
    {
      title: "Your Weight Goals",
      subtitle: "We'll track your progress and celebrate every pound lost.",
      emoji: "🎯",
      fields: (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={LS}>Starting Weight (lbs)</label>
              <input type="number" value={profile.startWeight} onChange={e=>setProfile({...profile,startWeight:e.target.value})}
                placeholder="e.g. 240" style={{...IS,fontSize:18,padding:"14px 16px"}}/>
            </div>
            <div>
              <label style={LS}>Goal Weight (lbs)</label>
              <input type="number" value={profile.goalWeight} onChange={e=>setProfile({...profile,goalWeight:e.target.value})}
                placeholder="e.g. 215" style={{...IS,fontSize:18,padding:"14px 16px"}}/>
            </div>
          </div>
          {profile.startWeight && profile.goalWeight && Number(profile.startWeight) > Number(profile.goalWeight) && (
            <div style={{background:"#e8ff4715",border:"1px solid #e8ff4730",borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:"#e8ff47"}}>
                {Number(profile.startWeight) - Number(profile.goalWeight)} lbs
              </div>
              <div style={{fontSize:12,color:"#888",marginTop:4}}>to lose · ~{Math.round((Number(profile.startWeight)-Number(profile.goalWeight))/1.5)} weeks at healthy pace</div>
            </div>
          )}
        </div>
      ),
      valid: profile.startWeight && profile.goalWeight && Number(profile.startWeight) > Number(profile.goalWeight),
    },
    {
      title: "Daily Nutrition Targets",
      subtitle: "Set your calorie and protein goals. You can always adjust these later.",
      emoji: "💪",
      fields: (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={LS}>Daily Calorie Target</label>
            <input type="number" value={profile.dailyCalories} onChange={e=>setProfile({...profile,dailyCalories:e.target.value})}
              placeholder="e.g. 2100" style={{...IS,fontSize:18,padding:"14px 16px"}}/>
            <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
              {[1800,2000,2100,2200,2500].map(c=>(
                <button key={c} onClick={()=>setProfile({...profile,dailyCalories:String(c)})} style={{
                  padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
                  background:profile.dailyCalories===String(c)?"#e8ff47":"#1a1a2e",
                  color:profile.dailyCalories===String(c)?"#0a0a0a":"#888"
                }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={LS}>Daily Protein Target (g)</label>
            <input type="number" value={profile.dailyProtein} onChange={e=>setProfile({...profile,dailyProtein:e.target.value})}
              placeholder="e.g. 190" style={{...IS,fontSize:18,padding:"14px 16px"}}/>
            <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
              {[150,170,180,190,200,220].map(p=>(
                <button key={p} onClick={()=>setProfile({...profile,dailyProtein:String(p)})} style={{
                  padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
                  background:profile.dailyProtein===String(p)?"#7fff6e":"#1a1a2e",
                  color:profile.dailyProtein===String(p)?"#0a0a0a":"#888"
                }}>{p}g</button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: profile.dailyCalories && profile.dailyProtein,
    },
  ];

  const currentStep = steps[step];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",gap:8,marginBottom:40}}>
        {steps.map((_,i)=>(
          <div key={i} style={{width:i===step?28:8,height:8,borderRadius:4,background:i===step?"#e8ff47":i<step?"#7fff6e":"#1a1a2e",transition:"all 0.3s ease"}}/>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{background:"#0f0f1e",borderRadius:24,padding:32,border:"1px solid #1e1e3a",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:16,textAlign:"center"}}>{currentStep.emoji}</div>
          <div style={{fontSize:26,fontWeight:700,fontFamily:"'Oswald',sans-serif",letterSpacing:2,color:"#e8ff47",textAlign:"center",textTransform:"uppercase",marginBottom:8}}>
            {currentStep.title}
          </div>
          <div style={{fontSize:13,color:"#666",textAlign:"center",marginBottom:28,lineHeight:1.6}}>
            {currentStep.subtitle}
          </div>
          {currentStep.fields}
        </div>
        <button onClick={()=>step < steps.length-1 ? setStep(step+1) : onComplete(profile)}
          disabled={!currentStep.valid}
          style={{
            width:"100%",padding:"16px",borderRadius:14,border:"none",cursor:currentStep.valid?"pointer":"not-allowed",
            background:currentStep.valid?"linear-gradient(135deg,#e8ff47,#c8e800)":"#1a1a2e",
            color:currentStep.valid?"#0a0a0a":"#333",
            fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:16,letterSpacing:2,textTransform:"uppercase",
            transition:"all 0.2s ease",
          }}>
          {step < steps.length - 1 ? "Continue →" : "Launch FORGE ⚡"}
        </button>
        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#333",letterSpacing:1}}>
          STEP {step+1} OF {steps.length}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FitnessTracker() {
  const [tab, setTab]                   = useState("dashboard");
  const [selectedDay, setSelectedDay]   = useState(getTodayName());
  const [logs, setLogs]                 = useState({});
  const [weighIns, setWeighIns]         = useState({});
  const [newWeight, setNewWeight]       = useState("");
  const [drinkLog, setDrinkLog]         = useState({});
  const [lastMealTime, setLastMealTime] = useState({});
  const [waterLog, setWaterLog]         = useState({});
  const [badCalLog, setBadCalLog]       = useState({});
  const [loaded, setLoaded]             = useState(false);
  const [toast, setToast]               = useState("");
  const [toastType, setToastType]       = useState("default");
  const [selectedBeerType, setSelectedBeerType] = useState(0);
  const [customBad, setCustomBad]       = useState({ name:"", calories:"", carbs:"", fat:"" });
  const [mi, setMi]                     = useState({ name:"", mealType:"Lunch", calories:"", protein:"", carbs:"", fat:"", fiber:"", notes:"" });
  const [profile, setProfile]           = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [customWaterOz, setCustomWaterOz]   = useState("");
  const [saveStatus, setSaveStatus]         = useState("idle");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const todayKey = getTodayKey();

  // ── Load from localStorage ──
  useEffect(() => {
    const savedLogs        = storage.get("forge_logs");
    const savedWeighIns    = storage.get("forge_weighIns");
    const savedDrinkLog    = storage.get("forge_drinkLog");
    const savedLastMeal    = storage.get("forge_lastMealTime");
    const savedWater       = storage.get("forge_waterLog");
    const savedBadCal      = storage.get("forge_badCalLog");
    const savedProfile     = storage.get("forge_userProfile");

    if(savedLogs)        setLogs(savedLogs);
    if(savedWeighIns)    setWeighIns(savedWeighIns);
    if(savedDrinkLog)    setDrinkLog(savedDrinkLog);
    if(savedLastMeal)    setLastMealTime(savedLastMeal);
    if(savedWater)       setWaterLog(savedWater);
    if(savedBadCal)      setBadCalLog(savedBadCal);
    if(savedProfile) {
      setProfile(savedProfile);
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
    setLoaded(true);
  }, []);

  // ── Auto-save to localStorage ──
  useEffect(() => {
    if(!loaded) return;
    storage.set("forge_logs",         logs);
    storage.set("forge_weighIns",     weighIns);
    storage.set("forge_drinkLog",     drinkLog);
    storage.set("forge_lastMealTime", lastMealTime);
    storage.set("forge_waterLog",     waterLog);
    storage.set("forge_badCalLog",    badCalLog);
  }, [logs, weighIns, drinkLog, lastMealTime, waterLog, badCalLog, loaded]);

  function showToast(msg, type="default") {
    setToast(msg); setToastType(type);
    setTimeout(()=>setToast(""), 2500);
  }

  function handleManualSave() {
    setSaveStatus("saving");
    storage.set("forge_logs",         logs);
    storage.set("forge_weighIns",     weighIns);
    storage.set("forge_drinkLog",     drinkLog);
    storage.set("forge_lastMealTime", lastMealTime);
    storage.set("forge_waterLog",     waterLog);
    storage.set("forge_badCalLog",    badCalLog);
    storage.set("forge_userProfile",  profile);
    setSaveStatus("saved");
    showToast("✓ All data saved", "save");
    setTimeout(()=>setSaveStatus("idle"), 2000);
  }

  function handleReset() {
    ["forge_logs","forge_weighIns","forge_drinkLog","forge_lastMealTime",
     "forge_waterLog","forge_badCalLog","forge_userProfile"].forEach(k=>storage.delete(k));
    setLogs({}); setWeighIns({}); setDrinkLog({}); setLastMealTime({});
    setWaterLog({}); setBadCalLog({}); setProfile(null);
    setShowResetConfirm(false);
    setShowOnboarding(true);
  }

  function nowTime() { return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}); }

  function pushBadCal(item) {
    const entry = { ...item, time: nowTime(), id: Date.now() + Math.random() };
    setBadCalLog(prev => ({ ...prev, [todayKey]: [...(prev[todayKey]||[]), entry] }));
  }

  const T = {
    calories: profile?.dailyCalories ? Number(profile.dailyCalories) : 2100,
    protein:  profile?.dailyProtein  ? Number(profile.dailyProtein)  : 190,
    carbs: 200, fat: 65, fiber: 30, water: 120,
  };

  const startW = profile?.startWeight ? Number(profile.startWeight) : 240;
  const goalW  = profile?.goalWeight  ? Number(profile.goalWeight)  : 215;

  const tl    = logs[todayKey]||[];
  const tCal  = tl.reduce((s,m)=>s+Number(m.calories||0),0);
  const tProt = tl.reduce((s,m)=>s+Number(m.protein||0),0);
  const tCarb = tl.reduce((s,m)=>s+Number(m.carbs||0),0);
  const tFat  = tl.reduce((s,m)=>s+Number(m.fat||0),0);
  const tFib  = tl.reduce((s,m)=>s+Number(m.fiber||0),0);
  const tWaterOz   = waterLog[todayKey]||0;
  const tLast      = lastMealTime[todayKey]||null;
  const todayDL    = drinkLog[todayKey] || { shots:0, beers:[] };
  const todayShots = todayDL.shots||0;
  const todayBeers = todayDL.beers||[];
  const todayBadCals  = badCalLog[todayKey]||[];
  const badCalTotal   = todayBadCals.reduce((s,b)=>s+Number(b.calories||0),0);
  const badCarbTotal  = todayBadCals.reduce((s,b)=>s+Number(b.carbs||0),0);
  const badFatTotal   = todayBadCals.reduce((s,b)=>s+Number(b.fat||0),0);
  const beerCalTotal  = todayBeers.reduce((s,b)=>s+(b.qty*(BEER_TYPES[b.typeIdx]?.calories||0)),0);
  const beerCarbTotal = todayBeers.reduce((s,b)=>s+(b.qty*(BEER_TYPES[b.typeIdx]?.carbs||0)),0);
  const totalBeerQty  = todayBeers.reduce((s,b)=>s+b.qty,0);

  const wEntries = Object.entries(weighIns).sort(([a],[b])=>a.localeCompare(b));
  const latestW  = wEntries.length ? wEntries[wEntries.length-1][1] : startW;
  const lost     = startW - latestW;
  const toGo     = latestW - goalW;
  const progPct  = Math.min(Math.max((lost/(startW-goalW))*100,0),100);

  function addMeal() {
    if(!mi.name||!mi.calories) return;
    const entry = { ...mi, time: nowTime(), id: Date.now() };
    setLogs({...logs,[todayKey]:[...(logs[todayKey]||[]),entry]});
    setMi({ name:"", mealType:"Lunch", calories:"", protein:"", carbs:"", fat:"", fiber:"", notes:"" });
    showToast("✓ Meal logged", "save");
  }
  function removeMeal(id) { setLogs({...logs,[todayKey]:(logs[todayKey]||[]).filter(m=>m.id!==id)}); }
  function logLastMeal() { const t=nowTime(); setLastMealTime({...lastMealTime,[todayKey]:t}); showToast(`Last meal stamped at ${t}`); }
  function logWeight() { if(!newWeight)return; setWeighIns({...weighIns,[todayKey]:Number(newWeight)}); setNewWeight(""); showToast("✓ Weight logged","save"); }

  function addWaterOz(oz) { setWaterLog({...waterLog,[todayKey]:(waterLog[todayKey]||0)+oz}); showToast(`💧 +${oz}oz logged`); }
  function removeWaterOz(oz) { const c=waterLog[todayKey]||0; setWaterLog({...waterLog,[todayKey]:Math.max(0,c-oz)}); }
  function addCustomWater() { const oz=Number(customWaterOz); if(!oz||oz<=0)return; addWaterOz(oz); setCustomWaterOz(""); }

  function addShot() {
    setDrinkLog({...drinkLog,[todayKey]:{ ...todayDL, shots:todayShots+1 }});
    pushBadCal({ name:"Tequila Shot", emoji:"🥃", calories:68, carbs:0, fat:0, source:"drinks" });
    showToast("🥃 Shot logged → Bad Cals updated");
  }
  function removeShot() {
    if(todayShots===0) return;
    setDrinkLog({...drinkLog,[todayKey]:{ ...todayDL, shots:todayShots-1 }});
    const bc=[...(badCalLog[todayKey]||[])];
    const idx=bc.map(b=>b.name).lastIndexOf("Tequila Shot");
    if(idx>-1) bc.splice(idx,1);
    setBadCalLog({...badCalLog,[todayKey]:bc});
  }
  function addBeer() {
    const bt=BEER_TYPES[selectedBeerType];
    const beers=[...todayBeers];
    const ex=beers.findIndex(b=>b.typeIdx===selectedBeerType);
    if(ex>-1) beers[ex]={...beers[ex],qty:beers[ex].qty+1}; else beers.push({typeIdx:selectedBeerType,qty:1});
    setDrinkLog({...drinkLog,[todayKey]:{ ...todayDL, beers }});
    pushBadCal({ name:bt.name, emoji:bt.emoji, calories:bt.calories, carbs:bt.carbs, fat:0, source:"drinks" });
    showToast(`${bt.emoji} ${bt.name} logged → Bad Cals updated`);
  }
  function removeBeer() {
    const beers=[...todayBeers];
    const ex=beers.findIndex(b=>b.typeIdx===selectedBeerType);
    if(ex===-1) return;
    const bt=BEER_TYPES[selectedBeerType];
    if(beers[ex].qty>1) beers[ex]={...beers[ex],qty:beers[ex].qty-1}; else beers.splice(ex,1);
    setDrinkLog({...drinkLog,[todayKey]:{ ...todayDL, beers }});
    const bc=[...(badCalLog[todayKey]||[])];
    const idx=bc.map(b=>b.name).lastIndexOf(bt.name);
    if(idx>-1) bc.splice(idx,1);
    setBadCalLog({...badCalLog,[todayKey]:bc});
  }
  function addBadPreset(p) { pushBadCal({...p,source:"food"}); showToast(`${p.emoji} ${p.name} → Bad Cals`); }
  function addCustomBad() {
    if(!customBad.name||!customBad.calories) return;
    pushBadCal({ name:customBad.name, emoji:"🍽️", calories:Number(customBad.calories), carbs:Number(customBad.carbs||0), fat:Number(customBad.fat||0), source:"custom" });
    setCustomBad({ name:"", calories:"", carbs:"", fat:"" });
    showToast("Added to Bad Cals");
  }
  function removeBadCal(id) { setBadCalLog({...badCalLog,[todayKey]:(badCalLog[todayKey]||[]).filter(b=>b.id!==id)}); }

  function completeOnboarding(prof) {
    setProfile(prof);
    storage.set("forge_userProfile", prof);
    setShowOnboarding(false);
    if(prof.startWeight) setWeighIns({ [todayKey]: Number(prof.startWeight) });
  }

  const tmpPlan = DAYS.includes(selectedDay) ? DEFAULT_DAILY_MEALS[selectedDay] : null;

  const tabStyle = t => ({
    padding:"10px 14px", background:tab===t?"#e8ff47":"transparent", color:tab===t?"#0a0a0a":"#666",
    border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontWeight:600,
    fontSize:12, letterSpacing:1, textTransform:"uppercase", transition:"all 0.2s", whiteSpace:"nowrap",
  });

  const MacroBar = ({label,value,target,color,unit="g"}) => {
    const pct=Math.min((value/target)*100,100);
    return (
      <div style={{marginBottom:9}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:11,color:"#777",textTransform:"uppercase",letterSpacing:1}}>{label}</span>
          <span style={{fontSize:11,color,fontWeight:600}}>{value}<span style={{color:"#444"}}>/{target}{label==="Calories"?"":unit}</span></span>
        </div>
        <div style={{background:"#1a1a2e",borderRadius:4,height:6,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:4,transition:"width 0.6s ease"}}/>
        </div>
      </div>
    );
  };

  const Ring = ({pct,color,size=80,stroke=8,label,value,unit}) => {
    const r=(size-stroke)/2, circ=2*Math.PI*r, dash=(pct/100)*circ;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
        <div style={{position:"relative",width:size,height:size}}>
          <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"absolute"}}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={stroke}/>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.6s ease"}}/>
          </svg>
          <div style={{position:"absolute",top:0,left:0,width:size,height:size,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color,fontFamily:"'Oswald',sans-serif",lineHeight:1}}>{value}</div>
            <div style={{fontSize:8,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>{unit}</div>
          </div>
        </div>
        <div style={{fontSize:10,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>{label}</div>
      </div>
    );
  };

  const MealTypeTag = ({type}) => {
    const colors={"Breakfast":"#e8ff47","Mid-Morning":"#fbbf24","Lunch":"#7fff6e","Snack":"#60a5fa","Dinner":"#f97316","Post-Workout":"#c084fc","Late Night":"#ff5e5e"};
    const c=colors[type]||"#888";
    return <span style={{fontSize:9,background:c+"22",color:c,padding:"2px 7px",borderRadius:20,letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>{type}</span>;
  };

  const CounterBtn = ({onClick,children,color="#1a1a2e",textColor="#888"}) => (
    <button onClick={onClick} style={{background:color,border:"none",color:textColor,borderRadius:8,width:44,height:44,fontSize:22,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {children}
    </button>
  );

  const SaveButton = () => (
    <button onClick={handleManualSave} style={{
      display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",
      background:saveStatus==="saved"?"#7fff6e":saveStatus==="saving"?"#e8ff4780":"#e8ff47",
      color:"#0a0a0a",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,
      letterSpacing:1,textTransform:"uppercase",transition:"all 0.3s ease",
      boxShadow:saveStatus==="saved"?"0 0 12px #7fff6e44":"none",
    }}>
      {saveStatus==="saving"?"⏳ Saving...":saveStatus==="saved"?"✓ Saved!":"💾 Save"}
    </button>
  );

  const sourceColor = s => s==="drinks"?"#f97316":s==="food"?"#ff5e5e":"#c084fc";
  const sourceLabel = s => s==="drinks"?"🍺 Drink":s==="food"?"🍟 Food":"✏️ Custom";

  if(!loaded) return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#e8ff47",fontFamily:"'Oswald',sans-serif",fontSize:20,letterSpacing:3}}>LOADING...</div>
    </div>
  );

  if(showOnboarding) return <OnboardingScreen onComplete={completeOnboarding}/>;

  const firstName = profile?.name?.split(" ")[0] || "Athlete";

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#f0f0f0",fontFamily:"'Inter',sans-serif",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#0d0d1a,#111128)",borderBottom:"1px solid #1e1e3a",padding:"20px 24px 16px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:"'Oswald',sans-serif",letterSpacing:2,color:"#e8ff47"}}>FORGE</div>
            <div style={{fontSize:11,color:"#666",letterSpacing:1}}>{startW} → {goalW} · {firstName.toUpperCase()}'S JOURNEY</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <SaveButton/>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:28,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:"#fff"}}>{latestW}<span style={{fontSize:14,color:"#666"}}>lb</span></div>
              <div style={{fontSize:10,color:"#e8ff47",letterSpacing:1}}>{lost>0?`↓ ${lost} LBS LOST`:"START LOGGING"}</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:12,background:"#1a1a2e",borderRadius:4,height:4,overflow:"hidden"}}>
          <div style={{width:`${progPct}%`,height:"100%",background:"linear-gradient(90deg,#e8ff47,#7fff6e)",borderRadius:4,transition:"width 0.8s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:10,color:"#555"}}>{startW} lb</span>
          <span style={{fontSize:10,color:"#e8ff47"}}>{progPct.toFixed(0)}% to goal</span>
          <span style={{fontSize:10,color:"#555"}}>{goalW} lb</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:4,padding:"10px 12px",background:"#0d0d1a",borderBottom:"1px solid #1a1a2e",overflowX:"auto"}}>
        {["dashboard","log","trends","meals","weight","drinks","settings"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={tabStyle(t)}>{t}</button>
        ))}
      </div>

      <div style={{padding:"20px 16px",maxWidth:600,margin:"0 auto"}}>

        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <div>
            <div style={{fontSize:13,color:"#555",letterSpacing:1,marginBottom:16,textTransform:"uppercase"}}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
            </div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:"20px 12px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-around",marginBottom:16}}>
                <Ring pct={Math.min((tCal/T.calories)*100,100)}  color={MC.calories} size={85} label="Calories" value={tCal}     unit="kcal"/>
                <Ring pct={Math.min((tProt/T.protein)*100,100)}  color={MC.protein}  size={85} label="Protein"  value={tProt}    unit="g"/>
                <Ring pct={Math.min((tWaterOz/T.water)*100,100)} color="#60a5fa"     size={85} label="Water"    value={tWaterOz} unit="oz"/>
              </div>
              <div style={{padding:"0 4px"}}>
                <MacroBar label="Calories" value={tCal}     target={T.calories} color={MC.calories} unit=""/>
                <MacroBar label="Protein"  value={tProt}    target={T.protein}  color={MC.protein}/>
                <MacroBar label="Carbs"    value={tCarb}    target={T.carbs}    color={MC.carbs}/>
                <MacroBar label="Fat"      value={tFat}     target={T.fat}      color={MC.fat}/>
                <MacroBar label="Fiber"    value={tFib}     target={T.fiber}    color={MC.fiber}/>
                <MacroBar label="Water"    value={tWaterOz} target={T.water}    color="#60a5fa" unit="oz"/>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <div style={{flex:1,background:"#0f0f1e",borderRadius:12,padding:14,borderLeft:"3px solid #ff5e5e"}}>
                <div style={{fontSize:10,color:"#ff5e5e",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Bad Cals Today</div>
                <div style={{fontSize:28,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:badCalTotal>0?"#ff5e5e":"#333"}}>{badCalTotal}</div>
                <div style={{fontSize:10,color:"#555",marginTop:2}}>{todayBadCals.length} items · {badCarbTotal}g carbs</div>
              </div>
              <div style={{flex:1,background:"#0f0f1e",borderRadius:12,padding:14}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Water Today</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:26,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:"#60a5fa"}}>{tWaterOz}</span>
                  <span style={{fontSize:11,color:"#555"}}>/ {T.water} oz</span>
                </div>
                <div style={{background:"#1a1a2e",borderRadius:4,height:4,marginTop:6,overflow:"hidden"}}>
                  <div style={{width:`${Math.min((tWaterOz/T.water)*100,100)}%`,height:"100%",background:"#60a5fa",borderRadius:4}}/>
                </div>
              </div>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Last Meal Stamped</div>
                <div style={{fontSize:22,fontWeight:700,fontFamily:"'Oswald',sans-serif",color:tLast?"#e8ff47":"#333"}}>{tLast||"--:--"}</div>
              </div>
              <button onClick={logLastMeal} style={{background:"#e8ff4720",color:"#e8ff47",border:"1px solid #e8ff4740",borderRadius:8,padding:"10px 16px",fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:11,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>
                Stamp Now
              </button>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:12,padding:16}}>
              <div style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Today's Meal Log</div>
              {tl.length===0 ? (
                <div style={{color:"#333",fontSize:13,textAlign:"center",padding:"20px 0"}}>No meals logged yet — head to Log tab</div>
              ) : tl.map(m=>{
                const late=m.time&&m.time.includes("PM")&&parseInt(m.time)>=8;
                return (
                  <div key={m.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #1a1a2e"}}>
                    <div style={{minWidth:46,background:"#1a1a2e",borderRadius:8,padding:"6px 4px",textAlign:"center",borderLeft:`3px solid ${late?"#ff5e5e":"#e8ff47"}`,flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:late?"#ff5e5e":"#e8ff47",fontFamily:"'Oswald',sans-serif"}}>{m.time?m.time.replace(/ (AM|PM)/,""):"--"}</div>
                      <div style={{fontSize:8,color:"#555"}}>{m.time?(m.time.includes("PM")?"PM":"AM"):""}</div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                        <div style={{fontSize:13,fontWeight:500}}>{m.name}</div>
                        {m.mealType&&<MealTypeTag type={m.mealType}/>}
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:MC.calories,fontWeight:600}}>{m.calories} cal</span>
                        {m.protein&&<span style={{fontSize:11,color:MC.protein}}>{m.protein}g P</span>}
                        {m.carbs&&<span style={{fontSize:11,color:MC.carbs}}>{m.carbs}g C</span>}
                        {m.fat&&<span style={{fontSize:11,color:MC.fat}}>{m.fat}g F</span>}
                        {m.fiber&&<span style={{fontSize:11,color:MC.fiber}}>{m.fiber}g Fi</span>}
                      </div>
                    </div>
                    <button onClick={()=>removeMeal(m.id)} style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0}}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOG */}
        {tab==="log" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:20,textTransform:"uppercase"}}>Log a Meal</div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:16,display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={LS}>Meal / Food Description</label>
                <input value={mi.name} onChange={e=>setMi({...mi,name:e.target.value})} placeholder="e.g. Chicken Caesar Salad" style={IS}/>
              </div>
              <div>
                <label style={LS}>Meal Type</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                  {MEAL_TYPES.map(t=>(
                    <button key={t} onClick={()=>setMi({...mi,mealType:t})} style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:mi.mealType===t?"#e8ff47":"#1a1a2e",color:mi.mealType===t?"#0a0a0a":"#888"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={LS}>Calories <span style={{color:"#e8ff47"}}>*</span></label><input type="number" value={mi.calories} onChange={e=>setMi({...mi,calories:e.target.value})} placeholder="e.g. 550" style={IS}/></div>
                <div><label style={LS}>Protein (g)</label><input type="number" value={mi.protein} onChange={e=>setMi({...mi,protein:e.target.value})} placeholder="e.g. 55" style={IS}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={LS}>Carbs (g)</label><input type="number" value={mi.carbs} onChange={e=>setMi({...mi,carbs:e.target.value})} placeholder="e.g. 30" style={IS}/></div>
                <div><label style={LS}>Fat (g)</label><input type="number" value={mi.fat} onChange={e=>setMi({...mi,fat:e.target.value})} placeholder="e.g. 18" style={IS}/></div>
              </div>
              <div><label style={LS}>Fiber (g)</label><input type="number" value={mi.fiber} onChange={e=>setMi({...mi,fiber:e.target.value})} placeholder="e.g. 4" style={IS}/></div>
              <div><label style={LS}>Notes (optional)</label><input value={mi.notes} onChange={e=>setMi({...mi,notes:e.target.value})} placeholder="e.g. post-workout, restaurant..." style={IS}/></div>
              <button onClick={addMeal} disabled={!mi.name||!mi.calories} style={{
                background:(!mi.name||!mi.calories)?"#1a1a2e":"linear-gradient(135deg,#e8ff47,#c8e800)",
                color:(!mi.name||!mi.calories)?"#333":"#0a0a0a",border:"none",borderRadius:10,padding:14,
                fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:15,letterSpacing:2,
                cursor:(!mi.name||!mi.calories)?"not-allowed":"pointer",textTransform:"uppercase",transition:"all 0.2s"
              }}>+ Log Meal</button>
            </div>

            {/* Water log */}
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:16}}>
              <div style={{fontSize:11,color:"#60a5fa",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>💧 Water Log — {tWaterOz} / {T.water} oz</div>
              <div style={{background:"#1a1a2e",borderRadius:6,height:8,marginBottom:16,overflow:"hidden"}}>
                <div style={{width:`${Math.min((tWaterOz/T.water)*100,100)}%`,height:"100%",background:"linear-gradient(90deg,#60a5fa,#38bdf8)",borderRadius:6,transition:"width 0.5s ease"}}/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {WATER_QUICK_ADD.map(oz=>(
                  <button key={oz} onClick={()=>addWaterOz(oz)} style={{
                    flex:1,padding:"12px 6px",borderRadius:10,border:"1px solid #60a5fa30",
                    background:"#60a5fa15",color:"#60a5fa",cursor:"pointer",
                    fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,
                  }}>+{oz}<br/><span style={{fontSize:9,fontWeight:400,color:"#60a5fa88"}}>oz</span></button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input type="number" value={customWaterOz} onChange={e=>setCustomWaterOz(e.target.value)} placeholder="Custom oz..." style={{...IS,flex:1,marginTop:0}}/>
                <button onClick={addCustomWater} style={{background:"#60a5fa",border:"none",color:"#0a0a0a",borderRadius:8,padding:"0 16px",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer"}}>+ Add</button>
                <button onClick={()=>removeWaterOz(8)} style={{background:"#1a1a2e",border:"none",color:"#888",borderRadius:8,padding:"0 14px",cursor:"pointer",fontSize:13}}>−8</button>
              </div>
            </div>

            <button onClick={logLastMeal} style={{width:"100%",background:"#0f0f1e",color:"#e8ff47",border:"1px solid #e8ff4730",borderRadius:10,padding:14,fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:11,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>
              ⏱ Stamp Last Meal {tLast?`(${tLast})`:""}
            </button>
          </div>
        )}

        {/* TRENDS */}
        {tab==="trends" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>Eating Trends</div>
            <div style={{fontSize:12,color:"#555",marginBottom:20}}>Spot patterns — timing, macros, late eating, hydration</div>
            {(()=>{
              const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d.toISOString().split("T")[0];});
              return (
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                  <div style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>7-Day Timeline</div>
                  {last7.map(dk=>{
                    const dl=logs[dk]||[], isToday=dk===todayKey;
                    const dayLabel=new Date(dk+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
                    const totalC=dl.reduce((s,m)=>s+Number(m.calories||0),0);
                    const totalP=dl.reduce((s,m)=>s+Number(m.protein||0),0);
                    const hasLate=dl.some(m=>m.time&&m.time.includes("PM")&&parseInt(m.time)>=8);
                    const waterOz=waterLog[dk]||0;
                    const badC=(badCalLog[dk]||[]).reduce((s,b)=>s+Number(b.calories||0),0);
                    return (
                      <div key={dk} style={{background:"#0f0f1e",borderRadius:12,padding:14,borderLeft:`3px solid ${isToday?"#e8ff47":"#1a1a2e"}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:dl.length?10:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:isToday?"#e8ff47":"#888"}}>{dayLabel}{isToday?" · Today":""}</div>
                          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                            {hasLate&&<span style={{fontSize:9,background:"#ff5e5e22",color:"#ff5e5e",padding:"2px 7px",borderRadius:20}}>LATE EAT</span>}
                            {badC>0&&<span style={{fontSize:9,background:"#ff5e5e22",color:"#ff5e5e",padding:"2px 7px",borderRadius:20}}>⚠️ {badC} bad cal</span>}
                            {waterOz>0&&<span style={{fontSize:9,color:"#60a5fa"}}>💧{waterOz}oz</span>}
                            {totalC>0&&<span style={{fontSize:12,color:"#e8ff47",fontWeight:600}}>{totalC} cal</span>}
                            {totalP>0&&<span style={{fontSize:11,color:"#7fff6e"}}>{totalP}g P</span>}
                            {dl.length===0&&<span style={{fontSize:11,color:"#333"}}>No data</span>}
                          </div>
                        </div>
                        {dl.length>0&&(
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            {dl.map(m=>{
                              const late=m.time&&m.time.includes("PM")&&parseInt(m.time)>=8;
                              return (
                                <div key={m.id} style={{display:"flex",gap:8,alignItems:"center"}}>
                                  <div style={{width:7,height:7,borderRadius:"50%",background:late?"#ff5e5e":"#e8ff47",flexShrink:0}}/>
                                  <div style={{fontSize:10,color:late?"#ff5e5e":"#888",minWidth:54,fontWeight:600}}>{m.time}</div>
                                  <div style={{fontSize:11,color:"#ccc",flex:1}}>{m.name}</div>
                                  {m.mealType&&<MealTypeTag type={m.mealType}/>}
                                  <div style={{fontSize:11,color:"#e8ff47",fontWeight:600}}>{m.calories} cal</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {(()=>{
              const allD=Object.entries(logs);
              const lateDays=allD.filter(([,m])=>m.some(x=>x.time&&x.time.includes("PM")&&parseInt(x.time)>=8)).length;
              const loggedD=allD.filter(([,m])=>m.length>0).length;
              const avgM=loggedD>0?(allD.reduce((s,[,m])=>s+m.length,0)/loggedD).toFixed(1):0;
              const wDays=Object.keys(waterLog).length;
              const avgW=wDays>0?(Object.values(waterLog).reduce((a,b)=>a+b,0)/wDays).toFixed(0):0;
              const avgP=loggedD>0?Math.round(allD.reduce((s,[,m])=>s+m.reduce((a,x)=>a+Number(x.protein||0),0),0)/loggedD):0;
              const totalBadDays=Object.values(badCalLog).filter(d=>d.length>0).length;
              return (
                <div style={{background:"#0f0f1e",borderRadius:12,padding:16}}>
                  <div style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Pattern Insights</div>
                  {[
                    {label:"Days logged",       value:`${loggedD} days`,  color:"#e8ff47"},
                    {label:"Avg meals / day",    value:avgM,               color:"#7fff6e"},
                    {label:"Avg protein / day",  value:`${avgP}g`,         color:"#7fff6e"},
                    {label:"Avg water / day",    value:`${avgW} oz`,       color:"#60a5fa"},
                    {label:"Late eating days",   value:`${lateDays} days`, color:lateDays>2?"#ff5e5e":"#7fff6e"},
                    {label:"Days with bad cals", value:`${totalBadDays}`,  color:totalBadDays>3?"#ff5e5e":"#e8ff47"},
                  ].map(s=>(
                    <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
                      <span style={{fontSize:13,color:"#888"}}>{s.label}</span>
                      <span style={{fontSize:13,fontWeight:600,color:s.color}}>{s.value}</span>
                    </div>
                  ))}
                  {lateDays>2&&<div style={{marginTop:12,background:"#ff5e5e15",border:"1px solid #ff5e5e30",borderRadius:8,padding:12,fontSize:12,color:"#ff5e5e",lineHeight:1.6}}>⚠️ Late eating on {lateDays} days — aim to finish by 7–8PM.</div>}
                  {Number(avgW)<80&&Number(avgW)>0&&<div style={{marginTop:10,background:"#60a5fa15",border:"1px solid #60a5fa30",borderRadius:8,padding:12,fontSize:12,color:"#60a5fa",lineHeight:1.6}}>💧 Averaging {avgW}oz/day — goal is 120oz. Dehydration mimics hunger.</div>}
                </div>
              );
            })()}
          </div>
        )}

        {/* MEALS */}
        {tab==="meals" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Weekly Meal Plan</div>
            <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
              {[...DAYS,"Saturday","Sunday"].map(d=>(
                <button key={d} onClick={()=>setSelectedDay(d)} style={{padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",whiteSpace:"nowrap",background:selectedDay===d?"#e8ff47":"#1a1a2e",color:selectedDay===d?"#0a0a0a":"#888",fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>
            {!DAYS.includes(selectedDay) ? (
              <div style={{background:"#0f0f1e",borderRadius:16,padding:24,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🏖️</div>
                <div style={{color:"#888",lineHeight:1.6}}>{WEEKEND_MSG}</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {Object.entries(tmpPlan).map(([slot,data])=>{
                  const lbl={morning:"🌅 Morning",midMorning:"☀️ Mid-Morning",lunch:"🥗 Lunch",snack:"🥜 Snack",dinner:"🍽️ Dinner"}[slot];
                  return (
                    <div key={slot} style={{background:"#0f0f1e",borderRadius:12,padding:16,borderLeft:"3px solid #e8ff47"}}>
                      <div style={{fontSize:11,color:"#e8ff47",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{lbl}</div>
                      <div style={{fontSize:14,color:"#e0e0e0",lineHeight:1.5,marginBottom:10}}>{data.meal}</div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:MC.calories,fontWeight:600}}>{data.calories} cal</span>
                        <span style={{fontSize:11,color:MC.protein}}>{data.protein}g protein</span>
                        <span style={{fontSize:11,color:MC.carbs}}>{data.carbs}g carbs</span>
                        <span style={{fontSize:11,color:MC.fat}}>{data.fat}g fat</span>
                        <span style={{fontSize:11,color:MC.fiber}}>{data.fiber}g fiber</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{background:"#1a1a2e",borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Day Total</div>
                  <div style={{display:"flex",justifyContent:"space-around"}}>
                    {[
                      {label:"Cal",    val:Object.values(tmpPlan).reduce((s,m)=>s+m.calories,0),       color:MC.calories},
                      {label:"Protein",val:`${Object.values(tmpPlan).reduce((s,m)=>s+m.protein,0)}g`,  color:MC.protein},
                      {label:"Carbs",  val:`${Object.values(tmpPlan).reduce((s,m)=>s+m.carbs,0)}g`,    color:MC.carbs},
                      {label:"Fat",    val:`${Object.values(tmpPlan).reduce((s,m)=>s+m.fat,0)}g`,      color:MC.fat},
                      {label:"Fiber",  val:`${Object.values(tmpPlan).reduce((s,m)=>s+m.fiber,0)}g`,    color:MC.fiber},
                    ].map(s=>(
                      <div key={s.label} style={{textAlign:"center"}}>
                        <div style={{fontSize:16,fontWeight:700,fontFamily:"'Oswald',sans-serif",color:s.color}}>{s.val}</div>
                        <div style={{fontSize:9,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WEIGHT */}
        {tab==="weight" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:20,textTransform:"uppercase"}}>Weight Log</div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:16}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <label style={LS}>Today's Weight (lbs)</label>
                  <input type="number" value={newWeight} onChange={e=>setNewWeight(e.target.value)} placeholder="e.g. 238.5" style={{...IS,fontSize:16}}/>
                </div>
                <button onClick={logWeight} style={{background:"#e8ff47",color:"#0a0a0a",border:"none",borderRadius:8,padding:"12px 20px",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",marginBottom:1}}>LOG</button>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {[{label:"Current",value:`${latestW} lb`,color:"#e8ff47"},{label:"Lost",value:`${Math.max(lost,0)} lb`,color:"#7fff6e"},{label:"To Go",value:`${Math.max(toGo,0)} lb`,color:"#60a5fa"}].map(s=>(
                <div key={s.label} style={{flex:1,background:"#0f0f1e",borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:s.color}}>{s.value}</div>
                  <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#0f0f1e",borderRadius:12,padding:16}}>
              <div style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>History</div>
              {wEntries.length===0 ? (
                <div style={{color:"#333",textAlign:"center",padding:"20px 0",fontSize:13}}>No weigh-ins logged yet</div>
              ) : [...wEntries].reverse().map(([date,weight])=>(
                <div key={date} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
                  <div style={{fontSize:13,color:"#888"}}>{new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                  <div style={{fontSize:14,fontWeight:600,color:weight<startW?"#7fff6e":"#e8ff47"}}>{weight} lb</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRINKS */}
        {tab==="drinks" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:4,textTransform:"uppercase"}}>Drinks & Bad Cals</div>
            <div style={{fontSize:12,color:"#555",marginBottom:20}}>Everything logged here auto-feeds into your Bad Calorie counter</div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:12}}>
              <div style={{fontSize:11,color:"#e8ff47",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>🥃 Tequila Shots</div>
              <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center"}}>
                <CounterBtn onClick={removeShot}>−</CounterBtn>
                <div style={{textAlign:"center",minWidth:80}}>
                  <div style={{fontSize:56,fontWeight:800,fontFamily:"'Oswald',sans-serif",lineHeight:1,color:todayShots===0?"#7fff6e":todayShots<=2?"#e8ff47":"#ff5e5e"}}>{todayShots}</div>
                  <div style={{fontSize:11,color:"#555",marginTop:4}}>≈ {todayShots*68} cal · {(todayShots*1.5).toFixed(1)}oz</div>
                </div>
                <CounterBtn onClick={addShot} color="#e8ff47" textColor="#0a0a0a">+</CounterBtn>
              </div>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:12}}>
              <div style={{fontSize:11,color:"#fbbf24",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>🍺 Beer</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {BEER_TYPES.map((bt,i)=>(
                  <button key={i} onClick={()=>setSelectedBeerType(i)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,border:`1px solid ${selectedBeerType===i?"#fbbf24":"#1a1a2e"}`,background:selectedBeerType===i?"#fbbf2415":"#131320",cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:20}}>{bt.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:selectedBeerType===i?"#fbbf24":"#ccc"}}>{bt.name}</div>
                      <div style={{fontSize:10,color:"#555"}}>{bt.eg}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:12,color:"#fbbf24",fontWeight:600}}>{bt.calories} cal</div>
                      <div style={{fontSize:10,color:"#555"}}>{bt.carbs}g carbs · {bt.alcohol}</div>
                    </div>
                    {todayBeers.find(b=>b.typeIdx===i)&&(
                      <div style={{background:"#fbbf24",color:"#0a0a0a",borderRadius:20,minWidth:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>
                        {todayBeers.find(b=>b.typeIdx===i).qty}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",background:"#131320",borderRadius:12,padding:14}}>
                <CounterBtn onClick={removeBeer}>−</CounterBtn>
                <div style={{textAlign:"center",minWidth:80}}>
                  <div style={{fontSize:48,fontWeight:800,fontFamily:"'Oswald',sans-serif",lineHeight:1,color:totalBeerQty===0?"#555":"#fbbf24"}}>{totalBeerQty}</div>
                  <div style={{fontSize:11,color:"#555",marginTop:4}}>≈ {beerCalTotal} cal · {beerCarbTotal}g carbs</div>
                </div>
                <CounterBtn onClick={addBeer} color="#fbbf24" textColor="#0a0a0a">+</CounterBtn>
              </div>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:12,borderLeft:"3px solid #ff5e5e"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:11,color:"#ff5e5e",letterSpacing:2,textTransform:"uppercase"}}>⚠️ Bad Calorie Counter</div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:800,fontFamily:"'Oswald',sans-serif",color:"#ff5e5e"}}>{badCalTotal}</div>
                  <div style={{fontSize:10,color:"#555"}}>{badCarbTotal}g carbs · {badFatTotal}g fat</div>
                </div>
              </div>
              <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Quick Add — Food</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {BAD_CAL_PRESETS.map((p,i)=>(
                  <button key={i} onClick={()=>addBadPreset(p)} style={{background:"#131320",border:"1px solid #2a2a3a",borderRadius:10,padding:"8px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:70}}>
                    <span style={{fontSize:20}}>{p.emoji}</span>
                    <span style={{fontSize:9,color:"#aaa",textAlign:"center",lineHeight:1.2}}>{p.name}</span>
                    <span style={{fontSize:9,color:"#ff5e5e",fontWeight:600}}>{p.calories} cal</span>
                  </button>
                ))}
              </div>
              <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Custom Entry</div>
              <div style={{display:"flex",flexDirection:"column",gap:10,background:"#131320",borderRadius:12,padding:14,marginBottom:16}}>
                <input value={customBad.name} onChange={e=>setCustomBad({...customBad,name:e.target.value})} placeholder="What did you eat?" style={IS}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  <input type="number" value={customBad.calories} onChange={e=>setCustomBad({...customBad,calories:e.target.value})} placeholder="Cal" style={IS}/>
                  <input type="number" value={customBad.carbs} onChange={e=>setCustomBad({...customBad,carbs:e.target.value})} placeholder="Carbs g" style={IS}/>
                  <input type="number" value={customBad.fat} onChange={e=>setCustomBad({...customBad,fat:e.target.value})} placeholder="Fat g" style={IS}/>
                </div>
                <button onClick={addCustomBad} style={{background:"#ff5e5e",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:2,cursor:"pointer",textTransform:"uppercase"}}>+ Add to Bad Cals</button>
              </div>
              {todayBadCals.length>0&&(
                <div>
                  <div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Today's Log</div>
                  {todayBadCals.map(b=>(
                    <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
                      <span style={{fontSize:18,flexShrink:0}}>{b.emoji}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                          <div style={{fontSize:13,color:"#ccc"}}>{b.name}</div>
                          <span style={{fontSize:9,background:sourceColor(b.source)+"22",color:sourceColor(b.source),padding:"2px 6px",borderRadius:20,letterSpacing:1,fontWeight:600}}>{sourceLabel(b.source)}</span>
                        </div>
                        <div style={{display:"flex",gap:8,marginTop:2}}>
                          <span style={{fontSize:11,color:"#ff5e5e",fontWeight:600}}>{b.calories} cal</span>
                          {b.carbs>0&&<span style={{fontSize:11,color:MC.carbs}}>{b.carbs}g carbs</span>}
                          {b.fat>0&&<span style={{fontSize:11,color:MC.fat}}>{b.fat}g fat</span>}
                          <span style={{fontSize:11,color:"#555"}}>{b.time}</span>
                        </div>
                      </div>
                      <button onClick={()=>removeBadCal(b.id)} style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{background:"#0f0f1e",borderRadius:12,padding:16}}>
              <div style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>This Week</div>
              {Object.keys(drinkLog).filter(d=>(new Date()-new Date(d+"T12:00:00"))<7*86400000).sort((a,b)=>b.localeCompare(a)).map(d=>{
                const dl=drinkLog[d]||{shots:0,beers:[]};
                const shots=dl.shots||0;
                const beers=(dl.beers||[]).reduce((s,b)=>s+b.qty,0);
                const badC=(badCalLog[d]||[]).reduce((s,b)=>s+Number(b.calories||0),0);
                if(shots===0&&beers===0&&badC===0) return null;
                return (
                  <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
                    <div style={{fontSize:13,color:"#888"}}>{new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      {shots>0&&<span style={{fontSize:11,color:"#e8ff47"}}>🥃 {shots}</span>}
                      {beers>0&&<span style={{fontSize:11,color:"#fbbf24"}}>🍺 {beers}</span>}
                      {badC>0&&<span style={{fontSize:11,color:"#ff5e5e"}}>⚠️ {badC} cal</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab==="settings" && (
          <div>
            <div style={{fontSize:18,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,marginBottom:20,textTransform:"uppercase"}}>Settings</div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:16,borderLeft:"3px solid #e8ff47"}}>
              <div style={{fontSize:11,color:"#e8ff47",letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Your Profile</div>
              {[
                {label:"Name",         value:profile?.name||"—"},
                {label:"Age",          value:profile?.age?`${profile.age} yrs`:"—"},
                {label:"Gender",       value:profile?.gender||"—"},
                {label:"Start Weight", value:profile?.startWeight?`${profile.startWeight} lb`:"—"},
                {label:"Goal Weight",  value:profile?.goalWeight?`${profile.goalWeight} lb`:"—"},
                {label:"Daily Cals",   value:profile?.dailyCalories?`${profile.dailyCalories} kcal`:"—"},
                {label:"Daily Protein",value:profile?.dailyProtein?`${profile.dailyProtein}g`:"—"},
                {label:"Water Goal",   value:"120 oz / day"},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
                  <span style={{fontSize:13,color:"#666"}}>{r.label}</span>
                  <span style={{fontSize:13,fontWeight:600,color:"#ccc"}}>{r.value}</span>
                </div>
              ))}
              <button onClick={()=>setShowOnboarding(true)} style={{marginTop:16,width:"100%",padding:"12px",borderRadius:10,border:"1px solid #e8ff4730",background:"#e8ff4710",color:"#e8ff47",fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>
                ✏️ Edit Profile
              </button>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,marginBottom:16}}>
              <div style={{fontSize:11,color:"#7fff6e",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Data & Storage</div>
              <p style={{fontSize:13,color:"#666",marginBottom:16,lineHeight:1.6}}>Your data auto-saves as you log. Use the button below to manually confirm everything is backed up.</p>
              <button onClick={handleManualSave} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",cursor:"pointer",background:saveStatus==="saved"?"#7fff6e":"linear-gradient(135deg,#e8ff47,#c8e800)",color:"#0a0a0a",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>
                {saveStatus==="saving"?"⏳ Saving...":saveStatus==="saved"?"✓ All Data Saved!":"💾 Save All Data"}
              </button>
            </div>
            <div style={{background:"#0f0f1e",borderRadius:16,padding:20,borderLeft:"3px solid #ff5e5e"}}>
              <div style={{fontSize:11,color:"#ff5e5e",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>⚠️ Danger Zone</div>
              <p style={{fontSize:13,color:"#666",marginBottom:16,lineHeight:1.6}}>Permanently erase all data and restart onboarding. Useful for testers starting fresh. Cannot be undone.</p>
              {!showResetConfirm ? (
                <button onClick={()=>setShowResetConfirm(true)} style={{width:"100%",padding:"14px",borderRadius:10,border:"1px solid #ff5e5e40",background:"#ff5e5e15",color:"#ff5e5e",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,letterSpacing:2,cursor:"pointer",textTransform:"uppercase"}}>Reset All Data</button>
              ) : (
                <div style={{background:"#ff5e5e15",border:"1px solid #ff5e5e40",borderRadius:10,padding:16}}>
                  <div style={{fontSize:13,color:"#ff5e5e",marginBottom:14,textAlign:"center",fontWeight:600}}>Are you sure? All data will be deleted.</div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>setShowResetConfirm(false)} style={{flex:1,padding:"12px",borderRadius:8,border:"none",background:"#1a1a2e",color:"#888",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>Cancel</button>
                    <button onClick={handleReset} style={{flex:1,padding:"12px",borderRadius:8,border:"none",background:"#ff5e5e",color:"#fff",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>Yes, Reset</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",bottom:30,left:"50%",transform:"translateX(-50%)",background:toastType==="save"?"#7fff6e":toastType==="warn"?"#ff5e5e":"#e8ff47",color:"#0a0a0a",padding:"10px 20px",borderRadius:20,fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:13,letterSpacing:1,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
