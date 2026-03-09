import { useState, useEffect } from "react";
import { storage } from "./storage";

// Bridge for code that uses window.storage (artifact runtime compat)
if (typeof window !== "undefined" && !(window as any).storage) {
  (window as any).storage = storage;
}

const localDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const TODAY = localDate(new Date());
const fmt = d => localDate(d);

const EXERCISE_POOL = [
  // ── LOWER BODY ──
  { name:"Barbell Back Squat", category:"lower", sets:"4 x 6-8", desc:"Bar on upper traps, feet shoulder-width. Brace core, push knees out, squat until thighs parallel or below. Drive through heels to stand." },
  { name:"Dumbbell Romanian Deadlift", category:"lower", sets:"3 x 10-12", desc:"Hold dumbbells in front of thighs. Hinge at hips pushing them back, back flat. Lower until strong hamstring stretch, then drive hips forward." },
  { name:"Kettlebell Goblet Squat", category:"lower", sets:"3 x 12-15", desc:"Hold kettlebell at chest. Feet slightly wider than shoulder-width. Squat deep, elbows push knees out at bottom." },
  { name:"Barbell Lunge", category:"lower", sets:"3 x 10 each leg", desc:"Bar on traps, step forward into a lunge until rear knee nearly touches floor. Push back to start. Keep torso upright." },
  { name:"Barbell Deadlift", category:"lower", sets:"4 x 5", desc:"Bar over mid-foot. Hip-width stance. Big breath, brace hard. Push floor away keeping bar close. Lock out hips and shoulders together." },
  { name:"Barbell Romanian Deadlift", category:"lower", sets:"4 x 6-8", desc:"Hinge back with flat back, pushing hips rearward. Lower to mid-shin feeling a strong hamstring stretch, then drive hips forward to lockout." },
  { name:"Barbell Hip Thrust", category:"lower", sets:"3 x 10-12", desc:"Upper back on bench or rack crossbar, bar across hips. Drive hips up explosively, squeeze glutes hard at top." },
  { name:"Dumbbell Step-Up", category:"lower", sets:"3 x 10 each leg", desc:"Hold dumbbells, step onto a sturdy box. Drive through the heel of the elevated foot to stand fully. Step down with control." },
  { name:"Barbell Front Squat", category:"lower", sets:"3 x 6-8", desc:"Bar rests on front delts, elbows high. Squat deep keeping torso upright. Stronger quad emphasis than back squat." },
  { name:"Kettlebell Bulgarian Split Squat", category:"lower", sets:"3 x 10 each leg", desc:"Rear foot on rack or box, hold kettlebell at chest. Lower until back knee nearly touches floor. Drive through front heel." },
  { name:"Dumbbell Sumo Squat", category:"lower", sets:"3 x 12-15", desc:"Wide stance, toes angled out, hold one heavy dumbbell between legs. Squat deep, keep chest up, drive through heels." },
  // ── UPPER BODY ──
  { name:"Dumbbell Floor Press", category:"upper", sets:"3 x 8-10", desc:"Lie on floor, dumbbells at chest, elbows ~45°. Press up fully. Lower until triceps touch floor before pressing again." },
  { name:"Dumbbell Row", category:"upper", sets:"3 x 10-12 each", desc:"Brace one hand on rack. Pull dumbbell toward hip — not shoulder — squeeze back at top. Control the descent." },
  { name:"Dumbbell Lateral Raise", category:"upper", sets:"3 x 12-15", desc:"Hold dumbbells at sides, slight bend in elbows. Raise arms out to sides until parallel with floor. Lower slowly." },
  { name:"Overhead Press", category:"upper", sets:"3 x 8-10", desc:"Bar or dumbbells at shoulders. Brace core hard. Press straight overhead, fully locked out, then lower with control." },
  { name:"Dumbbell Incline Floor Press", category:"upper", sets:"3 x 10", desc:"Prop upper back at ~30°. Press dumbbells up and slightly together. More upper chest than flat floor press." },
  { name:"Dumbbell Curl + Press Combo", category:"upper", sets:"3 x 10", desc:"Curl to shoulders then press overhead in one motion. Reverse to start. Keeps heart rate up while hitting biceps and shoulders." },
  { name:"Dumbbell Hammer Curl", category:"upper", sets:"3 x 10-12", desc:"Palms facing each other throughout the curl. Targets brachialis and forearm. Control on the way down." },
  { name:"Dumbbell Tricep Kickback", category:"upper", sets:"3 x 12 each", desc:"Hinge forward, upper arm parallel to floor. Extend forearm back fully, squeezing the tricep at lockout. Don't swing." },
  { name:"Push-Up Variations", category:"upper", sets:"3 x max", desc:"If standard is easy: archer, deficit (hands on plates), or add a plate on your back. Core rigid throughout.", bodyweight:true },
  { name:"Kettlebell Clean & Press", category:"upper", sets:"3 x 8 each", desc:"Clean bell from swing into rack position. Press overhead. Lower to rack, swing back down. Full body movement." },
  { name:"Barbell Bent Over Row", category:"upper", sets:"4 x 8-10", desc:"Hinge to 45°, pull bar to lower chest. Squeeze shoulder blades together at top. Control the negative." },
  { name:"Dumbbell Arnold Press", category:"upper", sets:"3 x 10-12", desc:"Start with dumbbells at chest, palms facing you. Rotate palms outward as you press overhead. Reverse on the way down." },
  { name:"Kettlebell Halo", category:"upper", sets:"3 x 8 each direction", desc:"Hold kettlebell by horns at chest. Circle it around your head keeping elbows tight. Great for shoulder mobility and stability." },
  { name:"Dumbbell Pullover", category:"upper", sets:"3 x 10-12", desc:"Lie on floor, hold one dumbbell overhead with both hands. Lower behind head with slight elbow bend, pull back to chest. Hits lats and chest." },
  { name:"Dumbbell Reverse Fly", category:"upper", sets:"3 x 12-15", desc:"Hinge forward, dumbbells hanging. Raise arms out to sides squeezing rear delts. Control the descent. Fights desk posture." },
  // ── CORE ──
  { name:"Plank", category:"core", sets:"3 x 30-45 sec", desc:"Forearms on floor, straight line head to heels. Squeeze glutes and abs, don't let hips sag.", bodyweight:true },
  { name:"Dead Bug", category:"core", sets:"3 x 8 each side", desc:"Lie on back, arms to ceiling, knees at 90°. Lower one arm and opposite leg while pressing lower back into ground. Alternate.", bodyweight:true },
  { name:"Ab Wheel Rollout", category:"core", sets:"3 x 8-10", desc:"Kneel, roll out as far as possible keeping back flat. Pull back in with abs — don't collapse.", bodyweight:true },
  { name:"Suitcase Carry", category:"core", sets:"3 x 40 steps each side", desc:"Heavy dumbbell in one hand, walk tall without leaning. Forces obliques and deep core to stabilize. Switch hands each set." },
  { name:"Kettlebell Windmill", category:"core", sets:"3 x 6 each side", desc:"Press kettlebell overhead, feet angled. Hinge sideways touching opposite foot while keeping bell locked overhead. Great for obliques and shoulder stability." },
  { name:"Pallof Press", category:"core", sets:"3 x 10 each side", desc:"Anchor a band to rack at chest height. Press arms straight out resisting rotation. Hold 2 seconds. Anti-rotation builds real core stability.", bodyweight:true },
  // ── CARDIO / CONDITIONING ──
  { name:"Kettlebell Swing", category:"cardio", sets:"4 x 15", desc:"Hip hinge, not a squat. Hike bell back between legs, snap hips forward explosively. Arms guide — power is all hips and glutes." },
  { name:"Farmer Carry", category:"cardio", sets:"3 x 40 steps", desc:"Heavy dumbbells, stand tall, walk. Shoulders back, core braced, don't lean. Grip, core, and traps all at once." },
  { name:"Kettlebell Snatch", category:"cardio", sets:"3 x 8 each arm", desc:"Swing kettlebell from between legs directly overhead in one fluid motion. Punch through at the top. Full body explosive power." },
  { name:"Dumbbell Thruster", category:"cardio", sets:"3 x 12", desc:"Dumbbells at shoulders, squat deep, then drive up explosively pressing dumbbells overhead. One fluid motion. Heart rate destroyer." },
  { name:"Barbell Complex", category:"cardio", sets:"3 x 6 each movement", desc:"Without setting bar down: 6 deadlifts, 6 rows, 6 cleans, 6 presses, 6 front squats. Light weight, no rest between movements." },
];
const POOL_BY_NAME = {};
EXERCISE_POOL.forEach(e => { POOL_BY_NAME[e.name] = e; });
const POOL_BY_CATEGORY = { upper:EXERCISE_POOL.filter(e=>e.category==="upper"), lower:EXERCISE_POOL.filter(e=>e.category==="lower"), core:EXERCISE_POOL.filter(e=>e.category==="core"), cardio:EXERCISE_POOL.filter(e=>e.category==="cardio") };

// ── User profiles ───────────────────────────────────────────────
const USER_PROFILES = {
  kyle: { name:"Kyle", age:36, height:"6'0\"", weight:"225 lbs", goal:"body recomposition", goalDesc:"lose fat, build muscle" },
  jessica: { name:"Jessica", age:34, height:"5'2\"", goal:"fat loss", goalDesc:"lose fat while maintaining muscle" },
};
const USER_IDS = Object.keys(USER_PROFILES);

const FEEL_OPTIONS = ["Too easy","Just right","Hard but good","Too heavy"];
const FEEL_COLORS = { "Too easy":"#48f","Just right":"#4f9","Hard but good":"#f90","Too heavy":"#f44" };

// Check if an exercise log entry has all required fields filled
function isExerciseComplete(exName, inputs) {
  const entry = inputs?.[exName];
  if (!entry) return false;
  const ex = POOL_BY_NAME[exName];
  if (!ex) return false;
  const needsWeight = !ex.bodyweight;
  if (needsWeight && !entry.weight) return false;
  if (!entry.reps) return false;
  if (!entry.feel) return false;
  return true;
}
function countIncomplete(exercises, inputs) {
  return exercises.filter(name => !isExerciseComplete(name, inputs)).length;
}
const storageKey = (user, d) => `${user}:tracker:${d}`;
const historyKey = (user, n) => `${user}:exhistory:${n.replace(/\s+/g,"_")}`;
const draftKey = (user, d) => `${user}:draft:${d}`;

// ── Storage helpers ──────────────────────────────────────────────
async function loadDay(user, date) {
  try { const r = await window.storage.get(storageKey(user, date)); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function saveDay(user, date, data) {
  try { await window.storage.set(storageKey(user, date), JSON.stringify(data)); } catch {}
}
async function loadExHistory(user, name) {
  try { const r = await window.storage.get(historyKey(user, name)); return r ? JSON.parse(r.value) : []; } catch { return []; }
}
async function saveExHistory(user, name, history) {
  try { await window.storage.set(historyKey(user, name), JSON.stringify(history)); } catch {}
}
async function loadRecentWorkouts(user) {
  try {
    const keys = await window.storage.list(`${user}:tracker:`);
    const dates = (keys.keys||[]).sort().slice(-14);
    const workouts = [];
    for (const k of dates) {
      try {
        const r = await window.storage.get(k);
        if (r) { const d = JSON.parse(r.value); if (d.workout && Array.isArray(d.workout)) workouts.push({ date: k.replace(`${user}:tracker:`,""), exercises: d.workout }); }
      } catch {}
    }
    return workouts;
  } catch { return []; }
}
async function loadDraft(user, date) {
  try { const r = await window.storage.get(draftKey(user, date)); return r && r.value ? JSON.parse(r.value) : null; } catch { return null; }
}
async function saveDraft(user, date, inputs) {
  try { await window.storage.set(draftKey(user, date), JSON.stringify(inputs)); } catch {}
}
async function clearDraft(user, date) {
  try { await window.storage.set(draftKey(user, date), ""); } catch {}
}

// ── Claude helpers ───────────────────────────────────────────────
async function callClaude(prompt, maxTokens=400) {
  const res = await fetch("/api/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, messages:[{ role:"user", content:prompt }] })
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type==="text")?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// Check if a specific user worked out yesterday (local check, no AI)
async function didWorkOutYesterday(user) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = storageKey(user, fmt(yesterday));
    const r = await window.storage.get(yKey);
    if (r && r.value) {
      const d = JSON.parse(r.value);
      return !!(d.workout && Array.isArray(d.workout) && d.workout.length > 0);
    }
  } catch {}
  return false;
}

// Pick shared exercises (always returns exercises, never rest day — rest day is determined locally per user)
async function getSharedExercises(recentWorkoutsKyle, recentWorkoutsJessica) {
  // Merge both users' recent workouts to avoid repeats
  const allRecent = [...recentWorkoutsKyle, ...recentWorkoutsJessica];
  const history = allRecent.length
    ? allRecent.sort((a,b) => a.date.localeCompare(b.date)).map(w => `${w.date}: ${w.exercises.join(", ")}`).join("\n")
    : "No recent workouts.";

  const poolText = Object.entries(POOL_BY_CATEGORY)
    .map(([cat, exs]) => `${cat.toUpperCase()}: ${exs.map(e => e.name).join(", ")}`)
    .join("\n");

  return callClaude(`You are a fitness coach. Two people (Kyle and Jessica) train together 3 days/week, full body each session. Home basement gym with squat rack, barbells, kettlebells, adjustable dumbbells.
Today: ${TODAY}
Recent workout history (both users):
${history}

Exercise pool by category:
${poolText}

Rules:
- Pick 7 exercises from the pool ensuring full-body coverage: 2-3 lower body, 2-3 upper body, 1-2 core, 1 cardio/conditioning.
- Avoid repeating exercises done in the last 2 workout sessions unless the pool is small for that category.
- Vary the selection so each workout feels different.
- Use exercise names EXACTLY as listed above.

Reply ONLY with JSON, no markdown:
{"exercises":["Exercise Name 1","Exercise Name 2"],"reason":"One sentence."}`, 600);
}

// Get per-user weight suggestions for a given exercise list
async function getWeightSuggestions(user, exercises, exerciseLogs) {
  const profile = USER_PROFILES[user];
  const logSummary = exercises.map(name => {
    const logs = exerciseLogs[name];
    if (!logs || !logs.length) return `${name}: no history`;
    const last = logs[logs.length-1];
    return `${name}: last ${last.weight||"BW"}lbs x ${last.reps||"?"}reps, felt "${last.feel||"?"}"`;
  }).join("\n");

  return callClaude(`You are a fitness coach. Suggest specific weights in lbs for ${profile.name} (${profile.age}yo, ${profile.height}${profile.weight ? ", "+profile.weight : ""}). Goal: ${profile.goalDesc}.

Today's exercises and ${profile.name}'s recent performance:
${logSummary}

Reply ONLY with JSON, no markdown:
{"Exercise Name 1":"135 lbs","Exercise Name 2":"45 lbs"}`, 300);
}

// ── Styles ───────────────────────────────────────────────────────
const iStyle = { width:"100%", background:"#222", border:"1px solid #333", borderRadius:8, padding:"10px 12px", color:"#eee", fontSize:14, marginBottom:8, boxSizing:"border-box", outline:"none" };
const btnStyle = (bg, fg, extra={}) => ({ width:"100%", background:bg, color:fg, border:"none", borderRadius:8, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", ...extra });

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

function getProgressNudge(ex, suggestion, history) {
  const lastEntry = history?.[history.length-1];
  if (!lastEntry) return { text:"First time — find your starting weight", icon:"🆕", color:"#48f" };
  const sugW = suggestion ? parseFloat(suggestion) : null;
  const lastW = lastEntry.weight ? parseFloat(lastEntry.weight) : null;
  // For bodyweight exercises, compare reps
  if (ex.bodyweight) {
    const lastR = lastEntry.reps ? parseInt(lastEntry.reps) : null;
    if (!lastR) return null;
    if (lastEntry.feel === "Too easy") return { text:`Beat ${lastR} reps — you said it was easy`, icon:"🔥", color:"#4f9" };
    if (lastEntry.feel === "Too heavy") return { text:`Match or scale back from ${lastR} reps`, icon:"📉", color:"#f90" };
    return { text:`Try to beat ${lastR} reps`, icon:"💪", color:"#4f9" };
  }
  // Weighted exercises
  if (sugW && lastW) {
    const diff = sugW - lastW;
    if (diff > 0) return { text:`↑ ${diff} lbs from last session`, icon:"🔥", color:"#4f9" };
    if (diff < 0) return { text:`↓ ${Math.abs(diff)} lbs — deload`, icon:"📉", color:"#f90" };
    return { text:"= Same weight — push for more reps", icon:"💪", color:"#48f" };
  }
  if (lastW && !sugW) {
    if (lastEntry.feel === "Too easy") return { text:`Was easy last time — try ${lastW + 5}+ lbs`, icon:"🔥", color:"#4f9" };
    if (lastEntry.feel === "Too heavy") return { text:`Felt heavy — stay at or below ${lastW} lbs`, icon:"📉", color:"#f90" };
    return { text:`Last: ${lastW} lbs — match or beat it`, icon:"💪", color:"#4f9" };
  }
  return null;
}

function ExerciseCard({ ex, suggestion, logInput, onLogChange, history, onSwap, availableSwaps }) {
  const [expanded, setExpanded] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const lastEntry = history?.[history.length-1];
  const suggestedWeight = suggestion ? parseFloat(suggestion) : null;
  const nudge = getProgressNudge(ex, suggestion, history);
  const catColors = { lower:"#4f9", upper:"#48f", core:"#f90", cardio:"#f48" };
  const catColor = catColors[ex.category] || "#888";
  const needsWeight = !ex.bodyweight;
  const missing = [];
  if (needsWeight && !logInput?.weight) missing.push("weight");
  if (!logInput?.reps) missing.push("reps");
  if (!logInput?.feel) missing.push("feel");
  const complete = missing.length === 0;
  return (
    <div style={{ borderBottom:"1px solid #222", paddingBottom:14, marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1, cursor:"pointer" }} onClick={() => setExpanded(e => !e)}>
          <div style={{ fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
            {complete ? <span style={{ color:"#4f9", fontSize:13 }}>✓</span> : <span style={{ color:"#555", fontSize:13 }}>○</span>}
            {ex.name} <span style={{ fontSize:10, padding:"2px 6px", borderRadius:8, background:`${catColor}22`, color:catColor, fontWeight:600 }}>{ex.category}</span>
          </div>
          <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{ex.sets}</div>
          {suggestion && <div style={{ fontSize:12, color:"#4f9", marginTop:4, background:"#0a2a15", padding:"4px 8px", borderRadius:6, display:"inline-block" }}>🤖 {suggestion}</div>}
          {lastEntry && <div style={{ fontSize:11, color:"#555", marginTop:4 }}>Last: {lastEntry.weight ? `${lastEntry.weight} lbs` : "—"} · {lastEntry.reps ? `${lastEntry.reps} reps` : "—"} · <span style={{ color:FEEL_COLORS[lastEntry.feel]||"#888" }}>{lastEntry.feel||"—"}</span></div>}
          {nudge && <div style={{ fontSize:11, color:nudge.color, marginTop:4 }}>{nudge.icon} {nudge.text}</div>}
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", marginLeft:8 }}>
          {availableSwaps && availableSwaps.length > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setShowSwap(s => !s); }}
              style={{ background:showSwap?"#333":"transparent", border:"1px solid #333", borderRadius:6, padding:"4px 8px", fontSize:11, color:"#888", cursor:"pointer", whiteSpace:"nowrap" }}>
              ⇄
            </button>
          )}
          <div style={{ color:"#4f9", fontSize:16, cursor:"pointer" }} onClick={() => setExpanded(e => !e)}>{expanded?"▲":"▼"}</div>
        </div>
      </div>
      {showSwap && (
        <div style={{ background:"#1e1e1e", border:"1px solid #333", borderRadius:8, marginTop:8, maxHeight:200, overflowY:"auto" }}>
          <div style={{ fontSize:11, color:"#666", padding:"8px 10px 4px", textTransform:"uppercase", letterSpacing:0.5 }}>Replace with…</div>
          {availableSwaps.map(swap => (
            <div key={swap.name}
              onClick={() => { onSwap(ex.name, swap.name); setShowSwap(false); }}
              style={{ padding:"8px 10px", cursor:"pointer", borderBottom:"1px solid #292929", fontSize:13, color:"#ccc" }}
              onMouseEnter={e => e.currentTarget.style.background="#292929"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ fontWeight:500 }}>{swap.name}</div>
              <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{swap.sets}</div>
            </div>
          ))}
        </div>
      )}
      {expanded && (
        <div style={{ marginTop:12 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:ex.bodyweight?"1fr":"1fr 1fr", gap:16, marginTop:12 }}>
        {!ex.bodyweight && <WeightButtons value={logInput?.weight} onChange={v => onLogChange(ex.name,"weight",v)} lastWeight={lastEntry?.weight} suggestedWeight={suggestedWeight} />}
        <RepButtons value={logInput?.reps} onChange={v => onLogChange(ex.name,"reps",v)} sets={ex.sets} />
      </div>
      <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
        {FEEL_OPTIONS.map(f => (
          <button key={f} onClick={() => onLogChange(ex.name,"feel",f)} style={{ padding:"5px 10px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"1px solid", background:logInput?.feel===f?FEEL_COLORS[f]:"transparent", color:logInput?.feel===f?"#000":FEEL_COLORS[f], borderColor:FEEL_COLORS[f] }}>{f}</button>
        ))}
      </div>
      {!complete && (logInput?.weight || logInput?.reps || logInput?.feel) && (
        <div style={{ fontSize:11, color:"#f90", marginTop:6 }}>Missing: {missing.join(", ")}</div>
      )}
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
          ["🥩","Hit your protein","Keep protein high on rest days to support recovery and muscle growth."],
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

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const match = document.cookie.match(/fitUser=(\w+)/);
      return match && USER_PROFILES[match[1]] ? match[1] : "kyle";
    } catch { return "kyle"; }
  });
  const [dayData, setDayData] = useState({ workout:null, workoutLog:{}, walked:false });
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [exHistories, setExHistories] = useState({});
  const [logInputs, setLogInputs] = useState({});
  const [historyDays, setHistoryDays] = useState([]);
  const [viewingDay, setViewingDay] = useState(null);
  const [viewingDayData, setViewingDayData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [workoutLogged, setWorkoutLogged] = useState(false);
  const [pastLogMode, setPastLogMode] = useState(false);
  const [pastLogDate, setPastLogDate] = useState("");
  const [pastLogExercises, setPastLogExercises] = useState([]);
  const [pastLogInputs, setPastLogInputs] = useState({});
  const [showExPicker, setShowExPicker] = useState(false);

  const profile = USER_PROFILES[currentUser];

  const switchUser = (userId) => {
    if (userId === currentUser) return;
    try { document.cookie = `fitUser=${userId};path=/;max-age=${60*60*24*365}`; } catch {}
    setCurrentUser(userId);
  };

  // Load user data — called on init and when user switches
  const loadUserData = async (user) => {
    setLoading(true);
    setDayData({ workout:null, workoutLog:{}, walked:false });
    setRecommendation(null);
    setLoadingRec(false);
    setExHistories({});
    setLogInputs({});
    setHistoryDays([]);
    setViewingDay(null);
    setViewingDayData(null);
    setShowHistory(false);
    setWorkoutLogged(false);
    setPastLogMode(false);
    setPastLogDate("");
    setPastLogExercises([]);
    setPastLogInputs({});
    setShowExPicker(false);

    const d = await loadDay(user, TODAY);
    const draft = await loadDraft(user, TODAY);
    if (d) {
      setDayData(d);
      // Merge: draft inputs take priority over saved workoutLog (draft is more recent mid-workout state)
      const merged = { ...(d.workoutLog || {}), ...(draft || {}) };
      if (Object.keys(merged).length) setLogInputs(merged);
      if (d.workout && Array.isArray(d.workout) && d.workout.length > 0) setWorkoutLogged(true);
    } else if (draft && Object.keys(draft).length) {
      setLogInputs(draft);
    }
    // Clean up stale recommendation caches from previous days
    try {
      const recKeys = await window.storage.list(`${user}:recommendation:`);
      for (const k of (recKeys.keys||[])) {
        if (k !== `${user}:recommendation:${TODAY}`) await window.storage.set(k, "");
      }
      const sharedKeys = await window.storage.list("shared:recommendation:");
      for (const k of (sharedKeys.keys||[])) {
        if (k !== `shared:recommendation:${TODAY}`) await window.storage.set(k, "");
      }
      // Clean up old draft keys
      const draftKeys = await window.storage.list(`${user}:draft:`);
      for (const k of (draftKeys.keys||[])) {
        if (k !== draftKey(user, TODAY)) await window.storage.set(k, "");
      }
    } catch {}
    setLoading(false);
  };

  // Initial load
  useEffect(() => { loadUserData(currentUser); }, []);

  // Reload when user switches
  useEffect(() => { loadUserData(currentUser); }, [currentUser]);

  // Reload page if date has changed (e.g. tab left open overnight)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const now = localDate(new Date());
        if (now !== TODAY) window.location.reload();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Load recommendation — per-user rest day check, shared exercises, per-user weight suggestions
  useEffect(() => {
    if (!recommendation && !loadingRec && !loading) {
      (async () => {
        setLoadingRec(true);

        // Load this user's exercise histories
        const historyEntries = await Promise.all(EXERCISE_POOL.map(async ex => { const h = await loadExHistory(currentUser, ex.name); return [ex.name, h]; }));
        const histories = {};
        for (const [name, h] of historyEntries) { if (h.length) histories[name] = h; }
        setExHistories(histories);

        // Check if THIS user worked out yesterday — rest day is per-user (always check first, overrides stale cache)
        const isRestDay = await didWorkOutYesterday(currentUser);
        if (isRestDay) {
          const rec = { restDay:true, reason:`${USER_PROFILES[currentUser].name} worked out yesterday — rest day for recovery.` };
          setRecommendation(rec);
          try { await window.storage.set(`${currentUser}:recommendation:${TODAY}`, JSON.stringify(rec)); } catch {}
          setLoadingRec(false);
          return;
        }

        // Check for cached per-user recommendation (workout day with exercises + weight suggestions)
        try {
          const cached = await window.storage.get(`${currentUser}:recommendation:${TODAY}`);
          if (cached && cached.value) {
            const rec = JSON.parse(cached.value);
            if (rec && rec.exercises && rec.exercises.length) {
              setRecommendation(rec);
              setLoadingRec(false);
              return;
            }
          }
        } catch {}

        // Not a rest day — get shared exercise selection
        let shared = null;
        try {
          const cachedShared = await window.storage.get(`shared:recommendation:${TODAY}`);
          if (cachedShared && cachedShared.value) {
            shared = JSON.parse(cachedShared.value);
            if (!shared || !shared.exercises || !shared.exercises.length) shared = null;
          }
        } catch {}

        // If no shared exercises yet, generate them
        if (!shared) {
          const [recentKyle, recentJessica] = await Promise.all([
            loadRecentWorkouts("kyle"),
            loadRecentWorkouts("jessica"),
          ]);
          shared = await getSharedExercises(recentKyle, recentJessica);
          try { await window.storage.set(`shared:recommendation:${TODAY}`, JSON.stringify(shared)); } catch {}
        }

        // Workout day — get per-user weight suggestions
        let suggestions = {};
        try { suggestions = await getWeightSuggestions(currentUser, shared.exercises, histories); } catch {}
        const rec = { restDay:false, exercises:shared.exercises, reason:shared.reason, suggestions };
        setRecommendation(rec);
        try { await window.storage.set(`${currentUser}:recommendation:${TODAY}`, JSON.stringify(rec)); } catch {}
        setLoadingRec(false);
      })();
    }
  }, [loading, currentUser]);

  // Load list of days that have workouts
  const loadHistoryDays = async () => {
    try {
      const keys = await window.storage.list(`${currentUser}:tracker:`);
      const days = [];
      for (const k of (keys.keys||[]).sort().reverse()) {
        const date = k.replace(`${currentUser}:tracker:`,"");
        try {
          const r = await window.storage.get(k);
          if (r) {
            const d = JSON.parse(r.value);
            if (d.workout && Array.isArray(d.workout) && d.workout.length > 0) {
              days.push({ date, exercises: d.workout, walked: d.walked });
            }
          }
        } catch {}
      }
      setHistoryDays(days);
    } catch { setHistoryDays([]); }
  };

  const viewDay = async (date) => {
    setViewingDay(date);
    const d = await loadDay(currentUser, date);
    setViewingDayData(d);
  };

  const clearTodayWorkout = async () => {
    const updated = { ...dayData, workout: null, workoutLog: {} };
    setDayData(updated);
    await saveDay(currentUser, TODAY, updated);
    setLogInputs({});
    await clearDraft(currentUser, TODAY);
    setWorkoutLogged(false);
    setRecommendation(null);
    // Clear cached recommendations so fresh ones are fetched
    try {
      await window.storage.set(`${currentUser}:recommendation:${TODAY}`, "");
      await window.storage.set(`shared:recommendation:${TODAY}`, "");
      // Also clear the other user's cached recommendation since exercises changed
      const otherUser = currentUser === "kyle" ? "jessica" : "kyle";
      await window.storage.set(`${otherUser}:recommendation:${TODAY}`, "");
    } catch {}
  };

  const save = async updated => { setDayData(updated); await saveDay(currentUser, TODAY, updated); };
  const updateLog = (name,field,val) => {
    setLogInputs(p => {
      const updated = { ...p, [name]:{ ...p[name],[field]:val } };
      saveDraft(currentUser, TODAY, updated);
      return updated;
    });
  };

  const swapExercise = async (oldName, newName) => {
    if (!recommendation || !recommendation.exercises) return;
    // Replace in exercise list
    const newExercises = recommendation.exercises.map(n => n === oldName ? newName : n);
    // Remove old suggestion, keep others
    const newSuggestions = { ...recommendation.suggestions };
    delete newSuggestions[oldName];
    const newRec = { ...recommendation, exercises: newExercises, suggestions: newSuggestions };
    setRecommendation(newRec);
    // Clear old exercise's draft inputs, keep others
    setLogInputs(p => {
      const updated = { ...p };
      delete updated[oldName];
      saveDraft(currentUser, TODAY, updated);
      return updated;
    });
    // Load new exercise's history
    const newHistory = await loadExHistory(currentUser, newName);
    setExHistories(p => ({ ...p, [newName]: newHistory }));
    // Persist updated recommendation to per-user cache
    try { await window.storage.set(`${currentUser}:recommendation:${TODAY}`, JSON.stringify(newRec)); } catch {}
  };

  const logWorkout = async () => {
    await save({ ...dayData, workout:recommendation.exercises, workoutLog:logInputs });
    for (const exName of recommendation.exercises) {
      const entry = logInputs[exName];
      if (entry&&(entry.weight||entry.reps||entry.feel)) {
        const existing = await loadExHistory(currentUser, exName);
        const updated = [...existing,{ date:TODAY,...entry }];
        await saveExHistory(currentUser, exName, updated);
        setExHistories(p => ({ ...p, [exName]:updated }));
      }
    }
    await clearDraft(currentUser, TODAY);
    setWorkoutLogged(true);
  };

  const togglePastExercise = (name) => {
    setPastLogExercises(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };
  const updatePastLog = (name, field, val) => {
    setPastLogInputs(p => ({ ...p, [name]: { ...p[name], [field]: val } }));
  };
  const logPastWorkout = async () => {
    if (!pastLogDate || pastLogExercises.length === 0) return;
    await saveDay(currentUser, pastLogDate, { workout: pastLogExercises, workoutLog: pastLogInputs, walked: false });
    for (const exName of pastLogExercises) {
      const entry = pastLogInputs[exName];
      if (entry && (entry.weight || entry.reps || entry.feel)) {
        const existing = await loadExHistory(currentUser, exName);
        const updated = [...existing, { date: pastLogDate, ...entry }];
        updated.sort((a, b) => a.date.localeCompare(b.date));
        await saveExHistory(currentUser, exName, updated);
      }
    }
    // Clear recommendation caches — past workout changes history which affects rest day check and AI suggestions
    try {
      await window.storage.set(`${currentUser}:recommendation:${TODAY}`, "");
      await window.storage.set(`shared:recommendation:${TODAY}`, "");
      const otherUser = currentUser === "kyle" ? "jessica" : "kyle";
      await window.storage.set(`${otherUser}:recommendation:${TODAY}`, "");
    } catch {}
    setRecommendation(null);
    setPastLogMode(false);
    setPastLogDate("");
    setPastLogExercises([]);
    setPastLogInputs({});
    setShowExPicker(false);
    setShowHistory(false);
    await loadHistoryDays();
  };

  if (loading) return <div style={{ background:"#111", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontFamily:"system-ui" }}>Loading...</div>;

  return (
    <div style={{ background:"#111", minHeight:"100vh", fontFamily:"system-ui, sans-serif", color:"#eee", maxWidth:600, margin:"0 auto", paddingBottom:40 }}>

      <div style={{ background:"#1a1a1a", padding:"20px 20px 0", borderBottom:"1px solid #2a2a2a" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
            <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Fitness Tracker</div>
          </div>
        </div>
        {/* ── User selector ── */}
        <div style={{ display:"flex", gap:8, paddingBottom:16 }}>
          {USER_IDS.map(uid => (
            <button key={uid} onClick={() => switchUser(uid)}
              style={{ flex:1, padding:"8px 0", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", border:"1px solid", transition:"all 0.2s",
                background: uid===currentUser ? "#4f9" : "transparent",
                color: uid===currentUser ? "#000" : "#888",
                borderColor: uid===currentUser ? "#4f9" : "#333",
              }}>
              {USER_PROFILES[uid].name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:20 }}>

        {/* ── History toggle + clear workout ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <button onClick={async () => { if (!showHistory) await loadHistoryDays(); setShowHistory(h => !h); setViewingDay(null); setViewingDayData(null); setPastLogMode(false); setPastLogDate(""); setPastLogExercises([]); setPastLogInputs({}); setShowExPicker(false); }}
            style={{ flex:1, ...btnStyle(showHistory?"#333":"#1a1a1a", showHistory?"#eee":"#888", { border:"1px solid #333", fontSize:13, padding:"10px 12px" }) }}>
            {showHistory ? "← Back to Today" : "📋 Workout History"}
          </button>
          {(workoutLogged || (Array.isArray(dayData.workout) && dayData.workout.length > 0)) && !showHistory && (
            <button onClick={clearTodayWorkout}
              style={btnStyle("#2a1a1a","#f44",{ border:"1px solid #f44", fontSize:13, padding:"10px 12px" })}>
              🗑 Clear Today
            </button>
          )}
        </div>

        {/* ── History view ── */}
        {showHistory && !viewingDay && !pastLogMode && (
          <div style={{ background:"#1a1a1a", borderRadius:12, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:0.5 }}>Past Workouts</div>
              <button onClick={() => setPastLogMode(true)}
                style={{ background:"#4f9", color:"#000", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                + Log Past Workout
              </button>
            </div>
            {historyDays.length === 0 && <div style={{ color:"#555", fontSize:13, textAlign:"center", padding:"20px 0" }}>No workouts logged yet.</div>}
            {historyDays.map(day => (
              <div key={day.date} onClick={() => viewDay(day.date)}
                style={{ padding:"12px 0", borderBottom:"1px solid #222", cursor:"pointer" }}
                onMouseEnter={e => e.currentTarget.style.background="#222"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>
                      {new Date(day.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                      {day.date === TODAY && <span style={{ fontSize:11, color:"#4f9", marginLeft:8 }}>Today</span>}
                    </div>
                    <div style={{ fontSize:12, color:"#666", marginTop:3 }}>
                      {day.exercises.slice(0,3).join(", ")}{day.exercises.length > 3 ? ` +${day.exercises.length-3} more` : ""}
                    </div>
                  </div>
                  <div style={{ color:"#555", fontSize:14 }}>→</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Log past workout form ── */}
        {showHistory && !viewingDay && pastLogMode && (
          <div style={{ background:"#1a1a1a", borderRadius:12, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:16, fontWeight:700 }}>Log Past Workout</div>
              <button onClick={() => { setPastLogMode(false); setPastLogDate(""); setPastLogExercises([]); setPastLogInputs({}); setShowExPicker(false); }}
                style={{ background:"none", border:"none", color:"#888", fontSize:13, cursor:"pointer" }}>Cancel</button>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#666", marginBottom:6, textTransform:"uppercase", letterSpacing:0.4 }}>Date</div>
              <input type="date" value={pastLogDate} max={TODAY}
                onChange={e => setPastLogDate(e.target.value)}
                style={{ ...iStyle, colorScheme:"dark" }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <button onClick={() => setShowExPicker(p => !p)}
                style={btnStyle("#222", "#4f9", { border:"1px solid #333", fontSize:13 })}>
                {showExPicker ? "▲ Done selecting" : `+ Add exercises (${pastLogExercises.length} selected)`}
              </button>
              {showExPicker && (
                <div style={{ marginTop:8, maxHeight:300, overflowY:"auto", border:"1px solid #333", borderRadius:8 }}>
                  {Object.entries(POOL_BY_CATEGORY).map(([cat, exs]) => (
                    <div key={cat}>
                      <div style={{ fontSize:11, color:"#666", padding:"8px 10px 4px", textTransform:"uppercase", letterSpacing:0.5, background:"#181818", position:"sticky", top:0, zIndex:1 }}>{cat}</div>
                      {exs.map(ex => {
                        const selected = pastLogExercises.includes(ex.name);
                        return (
                          <div key={ex.name} onClick={() => togglePastExercise(ex.name)}
                            style={{ padding:"8px 10px", cursor:"pointer", borderBottom:"1px solid #222", display:"flex", alignItems:"center", gap:8, background:selected?"#1a2a1a":"transparent" }}>
                            <span style={{ color:selected?"#4f9":"#444", fontSize:14 }}>{selected?"✓":"○"}</span>
                            <div>
                              <div style={{ fontSize:13, color:selected?"#eee":"#888" }}>{ex.name}</div>
                              <div style={{ fontSize:11, color:"#555" }}>{ex.sets}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pastLogExercises.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, color:"#666", marginBottom:10, textTransform:"uppercase", letterSpacing:0.4 }}>Log details for each exercise</div>
                {pastLogExercises.map(exName => {
                  const ex = POOL_BY_NAME[exName];
                  if (!ex) return null;
                  const needsWeight = !ex.bodyweight;
                  const pmissing = [];
                  if (needsWeight && !pastLogInputs[exName]?.weight) pmissing.push("weight");
                  if (!pastLogInputs[exName]?.reps) pmissing.push("reps");
                  if (!pastLogInputs[exName]?.feel) pmissing.push("feel");
                  const pcomplete = pmissing.length === 0;
                  return (
                    <div key={exName} style={{ borderBottom:"1px solid #222", paddingBottom:14, marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                            {pcomplete ? <span style={{ color:"#4f9", fontSize:13 }}>✓</span> : <span style={{ color:"#555", fontSize:13 }}>○</span>}
                            {ex.name}
                          </div>
                          <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{ex.sets}</div>
                        </div>
                        <button onClick={() => togglePastExercise(exName)}
                          style={{ background:"none", border:"none", color:"#f44", fontSize:12, cursor:"pointer" }}>✕ Remove</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:ex.bodyweight?"1fr":"1fr 1fr", gap:16, marginTop:12 }}>
                        {!ex.bodyweight && <WeightButtons value={pastLogInputs[exName]?.weight} onChange={v => updatePastLog(exName,"weight",v)} lastWeight={null} suggestedWeight={null} />}
                        <RepButtons value={pastLogInputs[exName]?.reps} onChange={v => updatePastLog(exName,"reps",v)} sets={ex.sets} />
                      </div>
                      <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                        {FEEL_OPTIONS.map(f => (
                          <button key={f} onClick={() => updatePastLog(exName,"feel",f)}
                            style={{ padding:"5px 10px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"1px solid",
                              background:pastLogInputs[exName]?.feel===f?FEEL_COLORS[f]:"transparent",
                              color:pastLogInputs[exName]?.feel===f?"#000":FEEL_COLORS[f],
                              borderColor:FEEL_COLORS[f] }}>{f}</button>
                        ))}
                      </div>
                      {!pcomplete && (pastLogInputs[exName]?.weight || pastLogInputs[exName]?.reps || pastLogInputs[exName]?.feel) && (
                        <div style={{ fontSize:11, color:"#f90", marginTop:6 }}>Missing: {pmissing.join(", ")}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {pastLogDate && pastLogExercises.length > 0 && (() => {
              const incomplete = countIncomplete(pastLogExercises, pastLogInputs);
              const label = `✓ Save Workout for ${new Date(pastLogDate+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}`;
              if (incomplete > 0) {
                return (
                  <div>
                    <button disabled style={{ ...btnStyle("#4f9","#000"), opacity:0.35, cursor:"not-allowed" }}>{label}</button>
                    <div style={{ fontSize:12, color:"#f90", textAlign:"center", marginTop:8 }}>{incomplete} exercise{incomplete>1?"s":""} still need{incomplete===1?"s":""} input</div>
                  </div>
                );
              }
              return <button onClick={logPastWorkout} style={btnStyle("#4f9","#000")}>{label}</button>;
            })()}
          </div>
        )}

        {/* ── Single day detail ── */}
        {showHistory && viewingDay && (
          <div>
            <button onClick={() => { setViewingDay(null); setViewingDayData(null); }}
              style={{ background:"none", border:"none", color:"#4f9", fontSize:13, cursor:"pointer", padding:0, marginBottom:12 }}>
              ← Back to list
            </button>
            <div style={{ background:"#1a1a1a", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>
                {new Date(viewingDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
              </div>
              {!viewingDayData ? <div style={{ color:"#555", fontSize:13, padding:"20px 0" }}>Loading...</div> : (
                <>
                  {viewingDayData.walked && <div style={{ fontSize:13, color:"#4f9", marginBottom:12 }}>🚶 Walk completed</div>}
                  {viewingDayData.workout && viewingDayData.workout.map(exName => {
                    const ex = POOL_BY_NAME[exName];
                    const log = viewingDayData.workoutLog?.[exName];
                    const catColors = { lower:"#4f9", upper:"#48f", core:"#f90", cardio:"#f48" };
                    return (
                      <div key={exName} style={{ padding:"10px 0", borderBottom:"1px solid #222" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:14, fontWeight:600 }}>{exName}</span>
                          {ex && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:8, background:`${catColors[ex.category]||"#888"}22`, color:catColors[ex.category]||"#888", fontWeight:600 }}>{ex.category}</span>}
                        </div>
                        {log ? (
                          <div style={{ fontSize:12, color:"#888", marginTop:4, display:"flex", gap:12 }}>
                            {log.weight && <span>{log.weight} lbs</span>}
                            {log.reps && <span>{log.reps} reps</span>}
                            {log.feel && <span style={{ color:FEEL_COLORS[log.feel]||"#888" }}>{log.feel}</span>}
                          </div>
                        ) : (
                          <div style={{ fontSize:12, color:"#555", marginTop:4 }}>No data logged</div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Today's workout (only when not viewing history) ── */}
        {!showHistory && loadingRec && (
          <div style={{ textAlign:"center", color:"#888", padding:40 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🤖</div>
            Reviewing {profile.name}'s history and building today's workout...
          </div>
        )}
        {!showHistory && !loadingRec && recommendation && recommendation.restDay && (
          <RestDay
            walked={dayData.walked}
            reason={recommendation.reason}
            onLog={async () => { await save({ ...dayData, walked:true }); }}
          />
        )}
        {!showHistory && !loadingRec && workoutLogged && (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
            <div style={{ fontSize:22, fontWeight:700, marginBottom:8, color:"#4f9" }}>Workout Logged!</div>
            <div style={{ fontSize:14, color:"#888", lineHeight:1.6, marginBottom:8 }}>
              Great work today. Recovery starts now — hydrate, eat protein, and rest up.
            </div>
            {dayData.workout && (
              <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginTop:20, textAlign:"left" }}>
                <div style={{ fontSize:12, color:"#666", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5, fontWeight:600 }}>Completed</div>
                {dayData.workout.map(exName => {
                  const ex = POOL_BY_NAME[exName];
                  const log = dayData.workoutLog?.[exName];
                  const catColors = { lower:"#4f9", upper:"#48f", core:"#f90", cardio:"#f48" };
                  return (
                    <div key={exName} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #222" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:"#4f9", fontSize:14 }}>✓</span>
                        <span style={{ fontSize:13, fontWeight:500 }}>{exName}</span>
                        {ex && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:8, background:`${catColors[ex.category]||"#888"}22`, color:catColors[ex.category]||"#888", fontWeight:600 }}>{ex.category}</span>}
                      </div>
                      {log && (log.weight || log.reps) && (
                        <span style={{ fontSize:12, color:"#666" }}>
                          {log.weight ? `${log.weight} lbs` : ""}{log.weight && log.reps ? " · " : ""}{log.reps ? `${log.reps} reps` : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {!showHistory && !loadingRec && !workoutLogged && recommendation && !recommendation.restDay && recommendation.exercises && (
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
            </div>
            <div style={{ fontSize:12, color:"#666", marginBottom:12 }}>Tap to expand. Log weight, reps, and how it felt — this trains future suggestions.</div>
            <div style={{ background:"#1a1a1a", borderRadius:12, padding:16, marginBottom:20 }}>
              {recommendation.exercises.map(exName => {
                const ex = POOL_BY_NAME[exName];
                if (!ex) return null;
                const currentNames = new Set(recommendation.exercises);
                const swaps = (POOL_BY_CATEGORY[ex.category] || []).filter(e => !currentNames.has(e.name));
                return <ExerciseCard key={exName} ex={ex} suggestion={recommendation.suggestions?.[exName]} logInput={logInputs[exName]} onLogChange={updateLog} history={exHistories[exName]||[]} onSwap={swapExercise} availableSwaps={swaps} />;
              })}
            </div>
            {(() => {
              const incomplete = countIncomplete(recommendation.exercises, logInputs);
              if (incomplete > 0) {
                return (
                  <div>
                    <button disabled style={{ ...btnStyle("#4f9","#000"), opacity:0.35, cursor:"not-allowed" }}>✓ Log Workout</button>
                    <div style={{ fontSize:12, color:"#f90", textAlign:"center", marginTop:8 }}>{incomplete} exercise{incomplete>1?"s":""} still need{incomplete===1?"s":""} input</div>
                  </div>
                );
              }
              return <button onClick={logWorkout} style={btnStyle("#4f9","#000")}>✓ Log Workout</button>;
            })()}
          </>
        )}

      </div>
    </div>
  );
}
