import { useState, useEffect } from "react";

const TODAY = new Date().toISOString().split("T")[0];
const fmt = d => d.toISOString().split("T")[0];

const EXERCISE_POOL = [
  // ── LOWER BODY ──
  { name:"Barbell Back Squat", category:"lower", sets:"4 x 6-8", desc:"Bar on upper traps, feet shoulder-width. Brace core, push knees out, squat until thighs parallel or below. Drive through heels to stand.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Squats.gif" },
  { name:"Dumbbell Romanian Deadlift", category:"lower", sets:"3 x 10-12", desc:"Hold dumbbells in front of thighs. Hinge at hips pushing them back, back flat. Lower until strong hamstring stretch, then drive hips forward.", gif:"https://upload.wikimedia.org/wikipedia/commons/4/41/Dumbbell-Romanian-Deadlift.gif" },
  { name:"Kettlebell Goblet Squat", category:"lower", sets:"3 x 12-15", desc:"Hold kettlebell at chest. Feet slightly wider than shoulder-width. Squat deep, elbows push knees out at bottom.", gif:"https://upload.wikimedia.org/wikipedia/commons/8/8b/Goblet-Squat.gif" },
  { name:"Barbell Lunge", category:"lower", sets:"3 x 10 each leg", desc:"Bar on traps, step forward into a lunge until rear knee nearly touches floor. Push back to start. Keep torso upright.", gif:"https://upload.wikimedia.org/wikipedia/commons/1/1e/Barbell-Lunge.gif" },
  { name:"Barbell Deadlift", category:"lower", sets:"4 x 5", desc:"Bar over mid-foot. Hip-width stance. Big breath, brace hard. Push floor away keeping bar close. Lock out hips and shoulders together.", gif:"https://upload.wikimedia.org/wikipedia/commons/6/sixth/Deadlift.gif" },
  { name:"Barbell Romanian Deadlift", category:"lower", sets:"4 x 6-8", desc:"Hinge back with flat back, pushing hips rearward. Lower to mid-shin feeling a strong hamstring stretch, then drive hips forward to lockout.", gif:"https://upload.wikimedia.org/wikipedia/commons/4/41/Dumbbell-Romanian-Deadlift.gif" },
  { name:"Barbell Hip Thrust", category:"lower", sets:"3 x 10-12", desc:"Upper back on bench or rack crossbar, bar across hips. Drive hips up explosively, squeeze glutes hard at top.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Squats.gif" },
  { name:"Dumbbell Step-Up", category:"lower", sets:"3 x 10 each leg", desc:"Hold dumbbells, step onto a sturdy box. Drive through the heel of the elevated foot to stand fully. Step down with control.", gif:"https://upload.wikimedia.org/wikipedia/commons/1/1e/Barbell-Lunge.gif" },
  { name:"Barbell Front Squat", category:"lower", sets:"3 x 6-8", desc:"Bar rests on front delts, elbows high. Squat deep keeping torso upright. Stronger quad emphasis than back squat.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Squats.gif" },
  { name:"Kettlebell Bulgarian Split Squat", category:"lower", sets:"3 x 10 each leg", desc:"Rear foot on rack or box, hold kettlebell at chest. Lower until back knee nearly touches floor. Drive through front heel.", gif:"https://upload.wikimedia.org/wikipedia/commons/1/1e/Barbell-Lunge.gif" },
  { name:"Dumbbell Sumo Squat", category:"lower", sets:"3 x 12-15", desc:"Wide stance, toes angled out, hold one heavy dumbbell between legs. Squat deep, keep chest up, drive through heels.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Squats.gif" },
  // ── UPPER BODY ──
  { name:"Dumbbell Floor Press", category:"upper", sets:"3 x 8-10", desc:"Lie on floor, dumbbells at chest, elbows ~45°. Press up fully. Lower until triceps touch floor before pressing again.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b4/Dumbbell-Floor-Press.gif" },
  { name:"Dumbbell Row", category:"upper", sets:"3 x 10-12 each", desc:"Brace one hand on rack. Pull dumbbell toward hip — not shoulder — squeeze back at top. Control the descent.", gif:"https://upload.wikimedia.org/wikipedia/commons/d/d5/Dumbbell-Row.gif" },
  { name:"Dumbbell Lateral Raise", category:"upper", sets:"3 x 12-15", desc:"Hold dumbbells at sides, slight bend in elbows. Raise arms out to sides until parallel with floor. Lower slowly.", gif:"https://upload.wikimedia.org/wikipedia/commons/9/9a/Lateral-Raise.gif" },
  { name:"Overhead Press", category:"upper", sets:"3 x 8-10", desc:"Bar or dumbbells at shoulders. Brace core hard. Press straight overhead, fully locked out, then lower with control.", gif:"https://upload.wikimedia.org/wikipedia/commons/5/5e/Overhead-Press.gif" },
  { name:"Dumbbell Incline Floor Press", category:"upper", sets:"3 x 10", desc:"Prop upper back at ~30°. Press dumbbells up and slightly together. More upper chest than flat floor press.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b4/Dumbbell-Floor-Press.gif" },
  { name:"Dumbbell Curl + Press Combo", category:"upper", sets:"3 x 10", desc:"Curl to shoulders then press overhead in one motion. Reverse to start. Keeps heart rate up while hitting biceps and shoulders.", gif:"https://upload.wikimedia.org/wikipedia/commons/c/c7/Bicep-Curl.gif" },
  { name:"Dumbbell Hammer Curl", category:"upper", sets:"3 x 10-12", desc:"Palms facing each other throughout the curl. Targets brachialis and forearm. Control on the way down.", gif:"https://upload.wikimedia.org/wikipedia/commons/c/c7/Bicep-Curl.gif" },
  { name:"Dumbbell Tricep Kickback", category:"upper", sets:"3 x 12 each", desc:"Hinge forward, upper arm parallel to floor. Extend forearm back fully, squeezing the tricep at lockout. Don't swing.", gif:"https://upload.wikimedia.org/wikipedia/commons/5/5e/Overhead-Press.gif" },
  { name:"Push-Up Variations", category:"upper", sets:"3 x max", desc:"If standard is easy: archer, deficit (hands on plates), or add a plate on your back. Core rigid throughout.", gif:"https://upload.wikimedia.org/wikipedia/commons/e/e4/Push-up.gif" },
  { name:"Kettlebell Clean & Press", category:"upper", sets:"3 x 8 each", desc:"Clean bell from swing into rack position. Press overhead. Lower to rack, swing back down. Full body movement.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/37/Kettlebell-Swing.gif" },
  { name:"Barbell Bent Over Row", category:"upper", sets:"4 x 8-10", desc:"Hinge to 45°, pull bar to lower chest. Squeeze shoulder blades together at top. Control the negative.", gif:"https://upload.wikimedia.org/wikipedia/commons/d/d5/Dumbbell-Row.gif" },
  { name:"Dumbbell Arnold Press", category:"upper", sets:"3 x 10-12", desc:"Start with dumbbells at chest, palms facing you. Rotate palms outward as you press overhead. Reverse on the way down.", gif:"https://upload.wikimedia.org/wikipedia/commons/5/5e/Overhead-Press.gif" },
  { name:"Kettlebell Halo", category:"upper", sets:"3 x 8 each direction", desc:"Hold kettlebell by horns at chest. Circle it around your head keeping elbows tight. Great for shoulder mobility and stability.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/37/Kettlebell-Swing.gif" },
  { name:"Dumbbell Pullover", category:"upper", sets:"3 x 10-12", desc:"Lie on floor, hold one dumbbell overhead with both hands. Lower behind head with slight elbow bend, pull back to chest. Hits lats and chest.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b4/Dumbbell-Floor-Press.gif" },
  { name:"Dumbbell Reverse Fly", category:"upper", sets:"3 x 12-15", desc:"Hinge forward, dumbbells hanging. Raise arms out to sides squeezing rear delts. Control the descent. Fights desk posture.", gif:"https://upload.wikimedia.org/wikipedia/commons/9/9a/Lateral-Raise.gif" },
  // ── CORE ──
  { name:"Plank", category:"core", sets:"3 x 30-45 sec", desc:"Forearms on floor, straight line head to heels. Squeeze glutes and abs, don't let hips sag.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b2/Plank-exercise.gif" },
  { name:"Dead Bug", category:"core", sets:"3 x 8 each side", desc:"Lie on back, arms to ceiling, knees at 90°. Lower one arm and opposite leg while pressing lower back into ground. Alternate.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b2/Plank-exercise.gif" },
  { name:"Ab Wheel Rollout", category:"core", sets:"3 x 8-10", desc:"Kneel, roll out as far as possible keeping back flat. Pull back in with abs — don't collapse.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b2/Plank-exercise.gif" },
  { name:"Suitcase Carry", category:"core", sets:"3 x 40 steps each side", desc:"Heavy dumbbell in one hand, walk tall without leaning. Forces obliques and deep core to stabilize. Switch hands each set.", gif:"https://upload.wikimedia.org/wikipedia/commons/d/d5/Dumbbell-Row.gif" },
  { name:"Kettlebell Windmill", category:"core", sets:"3 x 6 each side", desc:"Press kettlebell overhead, feet angled. Hinge sideways touching opposite foot while keeping bell locked overhead. Great for obliques and shoulder stability.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/37/Kettlebell-Swing.gif" },
  { name:"Pallof Press", category:"core", sets:"3 x 10 each side", desc:"Anchor a band to rack at chest height. Press arms straight out resisting rotation. Hold 2 seconds. Anti-rotation builds real core stability.", gif:"https://upload.wikimedia.org/wikipedia/commons/b/b2/Plank-exercise.gif" },
  // ── CARDIO / CONDITIONING ──
  { name:"Kettlebell Swing", category:"cardio", sets:"4 x 15", desc:"Hip hinge, not a squat. Hike bell back between legs, snap hips forward explosively. Arms guide — power is all hips and glutes.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/37/Kettlebell-Swing.gif" },
  { name:"Farmer Carry", category:"cardio", sets:"3 x 40 steps", desc:"Heavy dumbbells, stand tall, walk. Shoulders back, core braced, don't lean. Grip, core, and traps all at once.", gif:"https://upload.wikimedia.org/wikipedia/commons/d/d5/Dumbbell-Row.gif" },
  { name:"Kettlebell Snatch", category:"cardio", sets:"3 x 8 each arm", desc:"Swing kettlebell from between legs directly overhead in one fluid motion. Punch through at the top. Full body explosive power.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/37/Kettlebell-Swing.gif" },
  { name:"Dumbbell Thruster", category:"cardio", sets:"3 x 12", desc:"Dumbbells at shoulders, squat deep, then drive up explosively pressing dumbbells overhead. One fluid motion. Heart rate destroyer.", gif:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Squats.gif" },
  { name:"Barbell Complex", category:"cardio", sets:"3 x 6 each movement", desc:"Without setting bar down: 6 deadlifts, 6 rows, 6 cleans, 6 presses, 6 front squats. Light weight, no rest between movements.", gif:"https://upload.wikimedia.org/wikipedia/commons/6/sixth/Deadlift.gif" },
];
const POOL_BY_NAME = {};
EXERCISE_POOL.forEach(e => { POOL_BY_NAME[e.name] = e; });
const POOL_BY_CATEGORY = { upper:EXERCISE_POOL.filter(e=>e.category==="upper"), lower:EXERCISE_POOL.filter(e=>e.category==="lower"), core:EXERCISE_POOL.filter(e=>e.category==="core"), cardio:EXERCISE_POOL.filter(e=>e.category==="cardio") };

const TARGETS = { calories:2300, protein:180, carbs:215, fat:72 };
const FEEL_OPTIONS = ["Too easy","Just right","Hard but good","Too heavy"];
const FEEL_COLORS = { "Too easy":"#48f","Just right":"#4f9","Hard but good":"#f90","Too heavy":"#f44" };
const storageKey = d => `tracker:${d}`;
const historyKey = n => `exhistory:${n.replace(/\s+/g,"_")}`;
const FOOD_DB_KEY = "fooddb:entries";

// ── Storage helpers ──────────────────────────────────────────────
async function loadDay(date) {
  try { const r = await window.storage.get(storageKey(date)); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function saveDay(date, data) {
  try { await window.storage.set(storageKey(date), JSON.stringify(data)); } catch {}
}
async function loadExHistory(name) {
  try { const r = await window.storage.get(historyKey(name)); return r ? JSON.parse(r.value) : []; } catch { return []; }
}
async function saveExHistory(name, history) {
  try { await window.storage.set(historyKey(name), JSON.stringify(history)); } catch {}
}
async function loadFoodDB() {
  try { const r = await window.storage.get(FOOD_DB_KEY); return r ? JSON.parse(r.value) : {}; } catch { return {}; }
}
async function saveFoodDB(db) {
  try { await window.storage.set(FOOD_DB_KEY, JSON.stringify(db)); } catch {}
}
async function loadRecentWorkouts() {
  try {
    const keys = await window.storage.list("tracker:");
    const dates = (keys.keys||[]).sort().slice(-14);
    const workouts = [];
    for (const k of dates) {
      try {
        const r = await window.storage.get(k);
        if (r) { const d = JSON.parse(r.value); if (d.workout && Array.isArray(d.workout)) workouts.push({ date: k.replace("tracker:",""), exercises: d.workout }); }
      } catch {}
    }
    return workouts;
  } catch { return []; }
}

// ── Claude helpers ───────────────────────────────────────────────
async function callClaude(prompt, maxTokens=400) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, messages:[{ role:"user", content:prompt }] })
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type==="text")?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function getNutrition(foodName, weightG) {
  return callClaude(`You are a nutrition database. Return estimated macros for this food and weight.
Food: "${foodName}", Weight: ${weightG}g
Reply ONLY with JSON, no markdown:
{"calories":250,"protein":30,"carbs":10,"fat":8,"note":"optional short clarification"}`, 200);
}

async function getAIRecommendation(recentWorkouts, exerciseLogs) {
  const history = recentWorkouts.length
    ? recentWorkouts.map(w => `${w.date}: ${w.exercises.join(", ")}`).join("\n")
    : "No recent workouts.";
  const logSummary = Object.entries(exerciseLogs).map(([name,logs]) => {
    const last = logs[logs.length-1];
    return last ? `${name}: last ${last.weight||"BW"}lbs x ${last.reps||"?"}reps, felt "${last.feel||"?"}"` : null;
  }).filter(Boolean).join("\n");

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const recentDates = recentWorkouts.map(w => w.date);
  const workedYesterday = recentDates.includes(fmt(yesterday));

  const poolText = Object.entries(POOL_BY_CATEGORY)
    .map(([cat, exs]) => `${cat.toUpperCase()}: ${exs.map(e => e.name).join(", ")}`)
    .join("\n");

  return callClaude(`You are a fitness coach for body recomposition. User trains 3 days/week, full body each session, with at least one rest day between sessions.
Today: ${TODAY}
Recent workout history:
${history}
Recent performance:
${logSummary||"None yet."}
Worked yesterday: ${workedYesterday}.

Exercise pool by category:
${poolText}

Rules:
- If the user worked out yesterday, today is a rest day.
- Otherwise pick 7 exercises from the pool ensuring full-body coverage: 2-3 lower body, 2-3 upper body, 1-2 core, 1 cardio/conditioning.
- Avoid repeating exercises done in the last 2 workout sessions unless the pool is small for that category.
- Vary the selection so each workout feels different.
- For each picked exercise, suggest a specific weight in lbs based on their performance history. Use exercise names EXACTLY as listed above.

Reply ONLY with JSON, no markdown:
Workout day: {"restDay":false,"exercises":["Exercise Name 1","Exercise Name 2"],"reason":"One sentence.","suggestions":{"Exercise Name 1":"135 lbs"}}
Rest day: {"restDay":true,"reason":"One sentence why."}`, 600);
}

// ── Styles ───────────────────────────────────────────────────────
const iStyle = { width:"100%", background:"#222", border:"1px solid #333", borderRadius:8, padding:"10px 12px", color:"#eee", fontSize:14, marginBottom:8, boxSizing:"border-box", outline:"none" };
const btnStyle = (bg, fg, extra={}) => ({ width:"100%", background:bg, color:fg, border:"none", borderRadius:8, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", ...extra });

// ── Shared UI ────────────────────────────────────────────────────
function Bar({ val, target, color }) {
  return (
    <div style={{ background:"#2a2a2a", borderRadius:4, height:8, overflow:"hidden" }}>
      <div style={{ width:`${Math.min(100,Math.round(val/target*100))}%`, background:color, height:"100%", transition:"width 0.3s", borderRadius:4 }} />
    </div>
  );
}

function MacroField({ unit, value, onChange }) {
  return (
    <div style={{ position:"relative" }}>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="0" type="number"
        style={{ ...iStyle, marginBottom:0, paddingBottom:20 }} />
      <span style={{ position:"absolute", bottom:6, left:12, fontSize:10, color:"#555", pointerEvents:"none" }}>{unit}</span>
    </div>
  );
}

// ── Exercise logging ─────────────────────────────────────────────
function parseRepOptions(sets) {
  const timeMatch = sets.match(/x\s*(\d+)-(\d+)\s*sec/i);
  if (timeMatch) {
    const lo = parseInt(timeMatch[1]), hi = parseInt(timeMatch[2]);
    const opts = [];
    for (let i = lo; i <= hi; i += 5) opts.push(i);
    if (opts[opts.length-1] !== hi) opts.push(hi);
    return { opts, isTime:true };
  }
  const rangeMatch = sets.match(/x\s*(\d+)-(\d+)/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1]), hi = parseInt(rangeMatch[2]);
    const opts = [];
    for (let i = lo; i <= hi; i++) opts.push(i);
    return { opts, isTime:false };
  }
  const fixedMatch = sets.match(/x\s*(\d+)/);
  if (fixedMatch) return { opts:[parseInt(fixedMatch[1])], isTime:false };
  return { opts:[], isTime:false };
}

function WeightButtons({ value, onChange, lastWeight, suggestedWeight }) {
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const base = suggestedWeight ? parseFloat(suggestedWeight) : (lastWeight ? parseFloat(lastWeight) : null);
  const prev = lastWeight ? parseFloat(lastWeight) : null;
  const raw = [];
  if (prev && base && prev !== base) raw.push(prev);
  if (base) { raw.push(base); raw.push(base+10); raw.push(base+15); }
  else { [45,65,95,135].forEach(v => raw.push(v)); }
  const opts = [...new Set(raw.filter(v => v > 0))];
  const isOther = value && !opts.includes(value);
  const chip = active => ({ padding:"7px 12px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"1px solid", background:active?"#4f9":"transparent", color:active?"#000":"#4f9", borderColor:"#4f9", whiteSpace:"nowrap" });
  return (
    <div>
      <div style={{ fontSize:11, color:"#666", marginBottom:6, textTransform:"uppercase", letterSpacing:0.4 }}>Weight (lbs)</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:6 }}>
        {opts.map(w => <button key={w} onClick={() => { onChange(w); setShowInput(false); }} style={chip(value===w)}>{w}</button>)}
        <button onClick={() => setShowInput(v => !v)} style={chip(showInput||isOther)}>Other</button>
      </div>
      {(showInput||isOther) && (
        <input autoFocus type="number" min="0" placeholder="Enter lbs"
          value={inputVal||(isOther?value:"")}
          onChange={e => { setInputVal(e.target.value); onChange(e.target.value===""?"":parseFloat(e.target.value)); }}
          style={{ ...iStyle, marginBottom:0, fontSize:13 }} />
      )}
      {value ? <div style={{ fontSize:11, color:"#4f9", marginTop:4 }}>✓ {value} lbs</div> : null}
    </div>
  );
}

function RepButtons({ value, onChange, sets }) {
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { opts, isTime } = parseRepOptions(sets);
  const color = "#f90";
  const isOther = value && !opts.includes(value);
  const chip = active => ({ padding:"7px 12px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"1px solid", background:active?color:"transparent", color:active?"#000":color, borderColor:color });
  if (opts.length === 0) {
    return (
      <div>
        <div style={{ fontSize:11, color:"#666", marginBottom:6, textTransform:"uppercase", letterSpacing:0.4 }}>Reps</div>
        <input type="number" min="0" placeholder="Enter reps" value={value||""}
          onChange={e => onChange(e.target.value===""?"":parseInt(e.target.value))}
          style={{ ...iStyle, marginBottom:0, fontSize:13 }} />
        {value ? <div style={{ fontSize:11, color, marginTop:4 }}>✓ {value}</div> : null}
      </div>
    );
  }
  return (
    <div>
      <div style={{ fontSize:11, color:"#666", marginBottom:6, textTransform:"uppercase", letterSpacing:0.4 }}>{isTime?"Seconds":"Reps"}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:6 }}>
        {opts.map(r => <button key={r} onClick={() => { onChange(r); setShowInput(false); }} style={chip(value===r)}>{r}{isTime?"s":""}</button>)}
        <button onClick={() => setShowInput(v => !v)} style={chip(showInput||isOther)}>Other</button>
      </div>
      {(showInput||isOther) && (
        <input autoFocus type="number" min="0" placeholder={isTime?"Enter seconds":"Enter reps"}
          value={inputVal||(isOther?value:"")}
          onChange={e => { setInputVal(e.target.value); onChange(e.target.value===""?"":parseInt(e.target.value)); }}
          style={{ ...iStyle, marginBottom:0, fontSize:13 }} />
      )}
      {value ? <div style={{ fontSize:11, color, marginTop:4 }}>✓ {value}{isTime?"s":" reps"}</div> : null}
    </div>
  );
}

function ExerciseCard({ ex, suggestion, logInput, onLogChange, history }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lastEntry = history?.[history.length-1];
  const suggestedWeight = suggestion ? parseFloat(suggestion) : null;
  return (
    <div style={{ borderBottom:"1px solid #222", paddingBottom:14, marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", cursor:"pointer" }} onClick={() => setExpanded(e => !e)}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600 }}>{ex.name}</div>
          <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{ex.sets}</div>
          {suggestion && <div style={{ fontSize:12, color:"#4f9", marginTop:4, background:"#0a2a15", padding:"4px 8px", borderRadius:6, display:"inline-block" }}>🤖 {suggestion}</div>}
          {lastEntry && <div style={{ fontSize:11, color:"#555", marginTop:4 }}>Last: {lastEntry.weight ? `${lastEntry.weight} lbs` : "—"} · {lastEntry.reps ? `${lastEntry.reps} reps` : "—"} · <span style={{ color:FEEL_COLORS[lastEntry.feel]||"#888" }}>{lastEntry.feel||"—"}</span></div>}
        </div>
        <div style={{ color:"#4f9", fontSize:16, marginLeft:8 }}>{expanded?"▲":"▼"}</div>
      </div>
      {expanded && (
        <div style={{ marginTop:12 }}>
          {!imgError
            ? <img src={ex.gif} alt={ex.name} onError={() => setImgError(true)} style={{ width:"100%", borderRadius:8, marginBottom:10, maxHeight:220, objectFit:"cover", background:"#222" }} />
            : <div style={{ background:"#1f1f1f", borderRadius:8, padding:"30px 20px", textAlign:"center", color:"#555", fontSize:13, marginBottom:10 }}>🏋️ {ex.name}</div>
          }
          <p style={{ fontSize:13, color:"#aaa", lineHeight:1.6, margin:"0 0 12px" }}>{ex.desc}</p>
          {history?.length > 1 && (
            <div style={{ background:"#161616", borderRadius:8, padding:10, marginBottom:12 }}>
              <div style={{ fontSize:11, color:"#666", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>History</div>
              {history.slice(-4).reverse().map((h,i) => (
                <div key={i} style={{ fontSize:12, color:"#888", marginBottom:3, display:"flex", gap:8 }}>
                  <span style={{ color:"#555" }}>{h.date}</span>
                  <span>{h.weight ? `${h.weight} lbs` : "BW"}</span>
                  <span>{h.reps ? `${h.reps} reps` : ""}</span>
                  {h.feel && <span style={{ color:FEEL_COLORS[h.feel]||"#888" }}>{h.feel}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:12 }}>
        <WeightButtons value={logInput?.weight} onChange={v => onLogChange(ex.name,"weight",v)} lastWeight={lastEntry?.weight} suggestedWeight={suggestedWeight} />
        <RepButtons value={logInput?.reps} onChange={v => onLogChange(ex.name,"reps",v)} sets={ex.sets} />
      </div>
      <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
        {FEEL_OPTIONS.map(f => (
          <button key={f} onClick={() => onLogChange(ex.name,"feel",f)} style={{ padding:"5px 10px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"1px solid", background:logInput?.feel===f?FEEL_COLORS[f]:"transparent", color:logInput?.feel===f?"#000":FEEL_COLORS[f], borderColor:FEEL_COLORS[f] }}>{f}</button>
        ))}
      </div>
    </div>
  );
}

// ── Rest Day ─────────────────────────────────────────────────────
function RestDay({ walked, reason, onLog }) {
  return (
    <div>
      <div style={{ background:"#1a1a1a", borderRadius:12, padding:20, marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🚶</div>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Rest Day</div>
        <div style={{ fontSize:13, color:"#888", lineHeight:1.6 }}>{reason || "Today's a recovery day. Rest is where you build muscle back up."}</div>
      </div>
      <div style={{ background:"#1a1a1a", borderRadius:12, padding:20, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ fontSize:28 }}>🎯</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>Today's Task</div>
            <div style={{ fontSize:13, color:"#888", marginTop:2 }}>20–30 minute walk</div>
          </div>
        </div>
        <div style={{ fontSize:13, color:"#aaa", lineHeight:1.6, marginBottom:16 }}>
          Low-intensity walking accelerates recovery, burns extra calories without taxing your muscles, and adds up meaningfully over time. You don't need to track pace or distance — just get outside and move for 20–30 minutes.
        </div>
        {walked
          ? <div style={{ background:"#0a2a15", border:"1px solid #4f9", borderRadius:8, padding:"12px 16px", color:"#4f9", fontWeight:600, fontSize:14, textAlign:"center" }}>✓ Walk logged for today</div>
          : <button onClick={onLog} style={btnStyle("#4f9","#000")}>✓ I did my walk</button>
        }
      </div>
      <div style={{ background:"#1a1a1a", borderRadius:12, padding:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Rest Day Tips</div>
        {[
          ["💧","Stay hydrated","Muscle repair needs water. Aim for at least 8 glasses today."],
          ["🥩","Hit your protein","Rest days still need 175–185g protein to support recovery."],
          ["😴","Prioritize sleep","Most muscle growth happens during sleep. 7–8 hours matters."],
        ].map(([icon,title,desc]) => (
          <div key={title} style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ fontSize:20, marginTop:1 }}>{icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{title}</div>
              <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Food DB Modal ────────────────────────────────────────────────
function FoodDBModal({ db, onClose, onSelect, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState(""); const [servingSize, setServingSize] = useState(""); const [servingUnit, setServingUnit] = useState("g");
  const [cal, setCal] = useState(""); const [protein, setProtein] = useState(""); const [carbs, setCarbs] = useState(""); const [fat, setFat] = useState("");
  const [lookingUp, setLookingUp] = useState(false); const [note, setNote] = useState("");
  const entries = Object.values(db).sort((a,b) => a.name.localeCompare(b.name));

  const startNew = () => { setEditing("new"); setName(""); setServingSize(""); setServingUnit("g"); setCal(""); setProtein(""); setCarbs(""); setFat(""); setNote(""); };
  const startEdit = e => { setEditing(e.key); setName(e.name); setServingSize(e.servingSize.toString()); setServingUnit(e.servingUnit||"g"); setCal(e.cal.toString()); setProtein(e.protein.toString()); setCarbs(e.carbs.toString()); setFat(e.fat.toString()); setNote(""); };
  const lookup = async () => {
    if (!name.trim()||!servingSize) return;
    setLookingUp(true); setNote("");
    try { const r = await getNutrition(name.trim(), parseFloat(servingSize)); setCal(r.calories?.toString()||""); setProtein(r.protein?.toString()||""); setCarbs(r.carbs?.toString()||""); setFat(r.fat?.toString()||""); if (r.note) setNote(r.note); }
    catch { setNote("Lookup failed — enter manually."); }
    setLookingUp(false);
  };
  const save = () => {
    if (!name.trim()||!servingSize||!cal) return;
    const key = name.trim().toLowerCase().replace(/\s+/g,"_");
    onSave({ key, name:name.trim(), servingSize:parseFloat(servingSize), servingUnit, cal:parseFloat(cal)||0, protein:parseFloat(protein)||0, carbs:parseFloat(carbs)||0, fat:parseFloat(fat)||0 });
    setEditing(null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#1a1a1a", borderRadius:"16px 16px 0 0", width:"100%", maxWidth:600, maxHeight:"85vh", overflowY:"auto", padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:17, fontWeight:700 }}>Food Library</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#888", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        {editing ? (
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>{editing==="new"?"New Food":"Edit Food"}</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Food name" style={iStyle} />
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8 }}>
              <input value={servingSize} onChange={e => setServingSize(e.target.value)} placeholder="Serving size" type="number" min="0" style={iStyle} />
              <select value={servingUnit} onChange={e => setServingUnit(e.target.value)} style={{ ...iStyle, appearance:"none" }}>
                {["g","ml","oz","cup","tbsp","tsp","piece","slice"].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button onClick={lookup} disabled={!name.trim()||!servingSize||lookingUp} style={btnStyle("#1a3a2a","#4f9",{ border:"1px solid #4f9", marginBottom:8, opacity:(!name.trim()||!servingSize||lookingUp)?0.5:1 })}>
              {lookingUp?"Looking up...":"🔍 Look up nutrition"}
            </button>
            {note && <div style={{ fontSize:12, color:"#888", marginBottom:8, fontStyle:"italic" }}>ℹ️ {note}</div>}
            <div style={{ fontSize:12, color:"#666", marginBottom:6 }}>Macros per serving</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:12 }}>
              <MacroField unit="kcal" value={cal} onChange={setCal} />
              <MacroField unit="Protein (g)" value={protein} onChange={setProtein} />
              <MacroField unit="Carbs (g)" value={carbs} onChange={setCarbs} />
              <MacroField unit="Fat (g)" value={fat} onChange={setFat} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={() => setEditing(null)} style={btnStyle("#2a2a2a","#aaa")}>Cancel</button>
              <button onClick={save} disabled={!name.trim()||!servingSize||!cal} style={btnStyle("#4f9","#000",{ opacity:(!name.trim()||!servingSize||!cal)?0.4:1 })}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={startNew} style={btnStyle("#1a3a2a","#4f9",{ border:"1px solid #4f9", marginBottom:16 })}>+ New Food</button>
            {entries.length===0
              ? <div style={{ textAlign:"center", color:"#555", padding:"30px 0", fontSize:13 }}>No saved foods yet.</div>
              : entries.map(e => (
                <div key={e.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #222" }}>
                  <div style={{ flex:1, cursor:"pointer" }} onClick={() => onSelect(e)}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{e.name}</div>
                    <div style={{ fontSize:12, color:"#666", marginTop:2 }}>Per {e.servingSize}{e.servingUnit||"g"} · {e.cal}kcal · {e.protein}g P · {e.carbs}g C · {e.fat}g F</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => startEdit(e)} style={{ background:"none", border:"1px solid #333", borderRadius:6, color:"#888", fontSize:12, padding:"4px 8px", cursor:"pointer" }}>Edit</button>
                    <button onClick={() => onDelete(e.key)} style={{ background:"none", border:"1px solid #333", borderRadius:6, color:"#f44", fontSize:12, padding:"4px 8px", cursor:"pointer" }}>×</button>
                  </div>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("workout");
  const [dayData, setDayData] = useState({ foods:[], workout:null, workoutLog:{}, walked:false });
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [exHistories, setExHistories] = useState({});
  const [logInputs, setLogInputs] = useState({});
  const [foodDB, setFoodDB] = useState({});
  const [showDB, setShowDB] = useState(false);

  const [foodName, setFoodName] = useState(""); const [foodWeight, setFoodWeight] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [cal, setCal] = useState(""); const [protein, setProtein] = useState(""); const [carbs, setCarbs] = useState(""); const [fat, setFat] = useState("");
  const [lookingUp, setLookingUp] = useState(false); const [lookupNote, setLookupNote] = useState(""); const [lookupError, setLookupError] = useState("");
  const [selectedDBEntry, setSelectedDBEntry] = useState(null); const [servings, setServings] = useState("1");

  useEffect(() => {
    (async () => {
      const d = await loadDay(TODAY);
      if (d) { setDayData(d); if (d.workoutLog) setLogInputs(d.workoutLog); }
      const db = await loadFoodDB();
      setFoodDB(db);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (tab==="workout" && !recommendation && !loadingRec) {
      (async () => {
        setLoadingRec(true);
        const recentWorkouts = await loadRecentWorkouts();
        const historyEntries = await Promise.all(EXERCISE_POOL.map(async ex => { const h = await loadExHistory(ex.name); return [ex.name, h]; }));
        const histories = {};
        for (const [name, h] of historyEntries) { if (h.length) histories[name] = h; }
        setExHistories(histories);
        const rec = await getAIRecommendation(recentWorkouts, histories);
        setRecommendation(rec);
        setLoadingRec(false);
      })();
    }
  }, [tab]);

  const save = async updated => { setDayData(updated); await saveDay(TODAY, updated); };
  const removeFood = async id => save({ ...dayData, foods:dayData.foods.filter(f => f.id!==id) });
  const updateLog = (name,field,val) => setLogInputs(p => ({ ...p, [name]:{ ...p[name],[field]:val } }));

  const dbNames = Object.values(foodDB).map(e => e.name);
  const todayNames = [...new Set(dayData.foods.map(f => f.name.replace(/\s*\(.*\)$/,"").trim()))];
  const allKnownNames = [...new Set([...dbNames,...todayNames])];
  const suggestions = foodName.trim().length > 0
    ? allKnownNames.filter(n => n.toLowerCase().includes(foodName.toLowerCase()) && n.toLowerCase()!==foodName.toLowerCase())
    : [];

  const resetFoodForm = () => { setFoodName(""); setFoodWeight(""); setCal(""); setProtein(""); setCarbs(""); setFat(""); setLookupNote(""); setLookupError(""); setManualMode(false); setSelectedDBEntry(null); setServings("1"); };

  const selectSuggestion = name => {
    setFoodName(name); setShowSuggestions(false);
    const dbEntry = Object.values(foodDB).find(e => e.name.toLowerCase()===name.toLowerCase());
    if (dbEntry) {
      setSelectedDBEntry(dbEntry); setFoodWeight(dbEntry.servingSize.toString()); setServings("1");
      setCal(dbEntry.cal.toString()); setProtein(dbEntry.protein.toString()); setCarbs(dbEntry.carbs.toString()); setFat(dbEntry.fat.toString());
      setLookupNote(`From library: ${dbEntry.servingSize}${dbEntry.servingUnit||"g"} per serving`);
      return;
    }
    const match = [...dayData.foods].reverse().find(f => f.name.replace(/\s*\(.*\)$/,"").trim()===name);
    if (match) { setCal(match.cal.toString()); setProtein(match.protein.toString()); setCarbs(match.carbs.toString()); setFat(match.fat.toString()); setLookupNote("Pre-filled from today's log."); }
  };

  const handleServingsChange = val => {
    setServings(val);
    if (!selectedDBEntry) return;
    const s = parseFloat(val)||1;
    setCal((selectedDBEntry.cal*s).toFixed(0)); setProtein((selectedDBEntry.protein*s).toFixed(1));
    setCarbs((selectedDBEntry.carbs*s).toFixed(1)); setFat((selectedDBEntry.fat*s).toFixed(1));
    setFoodWeight((selectedDBEntry.servingSize*s).toFixed(0));
  };

  const lookupNutrition = async () => {
    if (!foodName.trim()||!foodWeight) return;
    setLookingUp(true); setLookupError(""); setLookupNote("");
    try {
      const r = await getNutrition(foodName.trim(), parseFloat(foodWeight));
      setCal(r.calories?.toString()||""); setProtein(r.protein?.toString()||""); setCarbs(r.carbs?.toString()||""); setFat(r.fat?.toString()||"");
      if (r.note) setLookupNote(r.note);
    } catch { setLookupError("Couldn't look up — enter manually."); setManualMode(true); }
    setLookingUp(false);
  };

  const macrosFilled = cal && protein && carbs && fat;

  const addFood = async () => {
    if (!foodName.trim()||!macrosFilled) return;
    const label = selectedDBEntry
      ? `${foodName} (${servings}x${selectedDBEntry.servingSize}${selectedDBEntry.servingUnit||"g"})`
      : `${foodName}${foodWeight ? ` (${foodWeight}g)` : ""}`;
    const entry = { id:Date.now(), name:label, cal:parseFloat(cal)||0, protein:parseFloat(protein)||0, carbs:parseFloat(carbs)||0, fat:parseFloat(fat)||0 };
    await save({ ...dayData, foods:[...dayData.foods,entry] });
    resetFoodForm();
  };

  const saveToLibrary = async () => {
    if (!foodName.trim()||!foodWeight||!macrosFilled) return;
    const key = foodName.trim().toLowerCase().replace(/\s+/g,"_");
    const entry = { key, name:foodName.trim(), servingSize:parseFloat(foodWeight), servingUnit:"g", cal:parseFloat(cal)||0, protein:parseFloat(protein)||0, carbs:parseFloat(carbs)||0, fat:parseFloat(fat)||0 };
    const updated = { ...foodDB, [key]:entry };
    setFoodDB(updated); await saveFoodDB(updated); setLookupNote("Saved to library ✓");
  };

  const handleDBSave = async entry => { const u = { ...foodDB, [entry.key]:entry }; setFoodDB(u); await saveFoodDB(u); };
  const handleDBDelete = async key => { const u = { ...foodDB }; delete u[key]; setFoodDB(u); await saveFoodDB(u); };
  const handleDBSelect = entry => {
    setShowDB(false); setFoodName(entry.name); setSelectedDBEntry(entry);
    setFoodWeight(entry.servingSize.toString()); setServings("1");
    setCal(entry.cal.toString()); setProtein(entry.protein.toString()); setCarbs(entry.carbs.toString()); setFat(entry.fat.toString());
    setLookupNote(`From library: ${entry.servingSize}${entry.servingUnit||"g"} per serving`);
  };

  const logWorkout = async () => {
    await save({ ...dayData, workout:recommendation.exercises, workoutLog:logInputs });
    for (const exName of recommendation.exercises) {
      const entry = logInputs[exName];
      if (entry&&(entry.weight||entry.reps||entry.feel)) {
        const existing = await loadExHistory(exName);
        const updated = [...existing,{ date:TODAY,...entry }];
        await saveExHistory(exName, updated);
        setExHistories(p => ({ ...p, [exName]:updated }));
      }
    }
  };

  const totals = dayData.foods.reduce((acc,f) => ({ cal:acc.cal+f.cal, protein:acc.protein+f.protein, carbs:acc.carbs+f.carbs, fat:acc.fat+f.fat }), { cal:0,protein:0,carbs:0,fat:0 });

  if (loading) return <div style={{ background:"#111", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontFamily:"system-ui" }}>Loading...</div>;

  return (
    <div style={{ background:"#111", minHeight:"100vh", fontFamily:"system-ui, sans-serif", color:"#eee", maxWidth:600, margin:"0 auto", paddingBottom:40 }}>
      {showDB && <FoodDBModal db={foodDB} onClose={() => setShowDB(false)} onSelect={handleDBSelect} onSave={handleDBSave} onDelete={handleDBDelete} />}

      <div style={{ background:"#1a1a1a", padding:"20px 20px 0", borderBottom:"1px solid #2a2a2a" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
            <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Daily Tracker</div>
          </div>
        </div>
      </div>

      <div style={{ padding:20 }}>

        {/* ── FOOD TAB ── */}
        {tab==="food" && (
          <>
            <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { label:"Calories", val:Math.round(totals.cal), target:TARGETS.calories, unit:"kcal", color:"#f90" },
                  { label:"Protein",  val:Math.round(totals.protein), target:TARGETS.protein, unit:"g", color:"#4f9" },
                  { label:"Carbs",    val:Math.round(totals.carbs), target:TARGETS.carbs, unit:"g", color:"#48f" },
                  { label:"Fat",      val:Math.round(totals.fat), target:TARGETS.fat, unit:"g", color:"#f48" },
                ].map(({ label,val,target,unit,color }) => (
                  <div key={label}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                      <span style={{ color:"#aaa" }}>{label}</span>
                      <span style={{ color }}>{val}<span style={{ color:"#555" }}>/{target}{unit}</span></span>
                    </div>
                    <Bar val={val} target={target} color={color} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:0.5 }}>Add Food</div>
                <button onClick={() => setShowDB(true)} style={{ background:"none", border:"none", color:"#4f9", fontSize:12, cursor:"pointer" }}>Browse library →</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8, position:"relative" }}>
                <div style={{ position:"relative" }}>
                  <input value={foodName} onChange={e => { setFoodName(e.target.value); setShowSuggestions(true); setSelectedDBEntry(null); }}
                    onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false),150)}
                    placeholder="Food name" style={iStyle} />
                  {showSuggestions && suggestions.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#2a2a2a", border:"1px solid #444", borderRadius:8, zIndex:10, overflow:"hidden", boxShadow:"0 4px 12px rgba(0,0,0,0.5)" }}>
                      {suggestions.slice(0,6).map((s,i) => (
                        <div key={i} onMouseDown={() => selectSuggestion(s)}
                          style={{ padding:"10px 12px", fontSize:13, cursor:"pointer", borderBottom:"1px solid #333", color:"#ddd", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                          onMouseEnter={e => e.currentTarget.style.background="#333"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                          <span>{s}</span>
                          {dbNames.includes(s) && <span style={{ fontSize:10, color:"#4f9", background:"#0a2a15", padding:"2px 6px", borderRadius:4 }}>Library</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedDBEntry
                  ? <input value={servings} onChange={e => handleServingsChange(e.target.value)} placeholder="Servings" type="number" min="0.25" step="0.25" style={iStyle} />
                  : <input value={foodWeight} onChange={e => setFoodWeight(e.target.value)} placeholder="Weight (g)" type="number" min="0" style={iStyle} />
                }
              </div>
              {selectedDBEntry && <div style={{ fontSize:12, color:"#666", marginBottom:8, marginTop:-4 }}>1 serving = {selectedDBEntry.servingSize}{selectedDBEntry.servingUnit||"g"} · adjust servings to scale macros</div>}
              {!macrosFilled && !selectedDBEntry && (
                <button onClick={lookupNutrition} disabled={!foodName.trim()||!foodWeight||lookingUp}
                  style={btnStyle("#1a3a2a","#4f9",{ border:"1px solid #4f9", marginBottom:8, opacity:(!foodName.trim()||!foodWeight||lookingUp)?0.5:1 })}>
                  {lookingUp?"Looking up nutrition...":"🔍 Look up nutrition"}
                </button>
              )}
              {lookupNote && <div style={{ fontSize:12, color:"#888", marginBottom:8, fontStyle:"italic" }}>ℹ️ {lookupNote}</div>}
              {lookupError && <div style={{ fontSize:12, color:"#f44", marginBottom:8 }}>{lookupError}</div>}
              {(macrosFilled||manualMode) && (
                <div>
                  <div style={{ fontSize:12, color:"#666", marginBottom:6 }}>Macros {selectedDBEntry?"(scaled to servings)":macrosFilled?"(edit if needed)":"(enter manually)"}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:10 }}>
                    <MacroField unit="kcal" value={cal} onChange={v => { setCal(v); setSelectedDBEntry(null); }} />
                    <MacroField unit="Protein (g)" value={protein} onChange={v => { setProtein(v); setSelectedDBEntry(null); }} />
                    <MacroField unit="Carbs (g)" value={carbs} onChange={v => { setCarbs(v); setSelectedDBEntry(null); }} />
                    <MacroField unit="Fat (g)" value={fat} onChange={v => { setFat(v); setSelectedDBEntry(null); }} />
                  </div>
                </div>
              )}
              {!macrosFilled && !manualMode && !selectedDBEntry && (
                <button onClick={() => setManualMode(true)} style={{ background:"none", border:"none", color:"#555", fontSize:12, cursor:"pointer", padding:0, marginBottom:8 }}>Enter macros manually instead</button>
              )}
              <div style={{ display:"grid", gridTemplateColumns:macrosFilled&&!selectedDBEntry&&foodWeight?"1fr 1fr":"1fr", gap:8 }}>
                {macrosFilled&&!selectedDBEntry&&foodWeight && (
                  <button onClick={saveToLibrary} style={btnStyle("#1a2a3a","#48f",{ border:"1px solid #48f" })}>💾 Save to Library</button>
                )}
                <button onClick={addFood} disabled={!foodName.trim()||!macrosFilled} style={btnStyle("#4f9","#000",{ opacity:(!foodName.trim()||!macrosFilled)?0.4:1 })}>+ Add Food</button>
              </div>
            </div>

            {dayData.foods.length > 0 && (
              <div style={{ background:"#1a1a1a", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Today's Log</div>
                {dayData.foods.map(f => (
                  <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #222" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500 }}>{f.name}</div>
                      <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{f.cal}kcal · {f.protein}g P · {f.carbs}g C · {f.fat}g F</div>
                    </div>
                    <button onClick={() => removeFood(f.id)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:18 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── WORKOUT TAB ── */}
        {tab==="workout" && (
          <>
            {loadingRec && (
              <div style={{ textAlign:"center", color:"#888", padding:40 }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🤖</div>
                Reviewing your history and building today's workout...
              </div>
            )}
            {!loadingRec && recommendation && recommendation.restDay && (
              <RestDay
                walked={dayData.walked}
                reason={recommendation.reason}
                onLog={async () => { await save({ ...dayData, walked:true }); }}
              />
            )}
            {!loadingRec && recommendation && !recommendation.restDay && recommendation.exercises && (
              <>
                <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ background:"#4f9", color:"#000", fontWeight:800, fontSize:24, width:52, height:52, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{"💪"}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:16 }}>Today's Workout</div>
                      <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{recommendation.reason}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                    {[["lower","#4f9"],["upper","#48f"],["core","#f90"],["cardio","#f48"]].map(([cat,color]) => {
                      const count = recommendation.exercises.filter(name => POOL_BY_NAME[name]?.category===cat).length;
                      if (!count) return null;
                      return <span key={cat} style={{ fontSize:11, padding:"3px 8px", borderRadius:12, background:`${color}22`, color, fontWeight:600 }}>{count} {cat}</span>;
                    })}
                  </div>
                  {Array.isArray(dayData.workout) && dayData.workout.length > 0 && (
                    <div style={{ marginTop:12, background:"#4f9", color:"#000", borderRadius:8, padding:"6px 12px", fontSize:13, fontWeight:600, display:"inline-block" }}>✓ Logged for today</div>
                  )}
                </div>
                <div style={{ fontSize:12, color:"#666", marginBottom:12 }}>Tap to expand. Log weight, reps, and how it felt — this trains future suggestions.</div>
                <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginBottom:20 }}>
                  {recommendation.exercises.map(exName => {
                    const ex = POOL_BY_NAME[exName];
                    if (!ex) return null;
                    return <ExerciseCard key={exName} ex={ex} suggestion={recommendation.suggestions?.[exName]} logInput={logInputs[exName]} onLogChange={updateLog} history={exHistories[exName]||[]} />;
                  })}
                </div>
                <button onClick={logWorkout} style={btnStyle("#4f9","#000")}>✓ Log Workout</button>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
