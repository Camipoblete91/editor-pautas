// Plantilla exacta (HTML head + CSS) del diseño de las pautas — marca "Stronger As Fuck".
// Esto es lo que se inyecta en cada archivo .html final que se le envía al paciente/alumno.
// Si en algún momento se rediseña la pauta (colores, tipografía, layout), se edita SOLO aquí.
const PLANTILLA_HEAD = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pauta de ejercicios — Stronger As Fuck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg: #10163F;
    --card: #1b1b1e;
    --card-border: #2c2c30;
    --ink: #f4f3ef;
    --ink-dim: #a9a8ab;
    --lime: #B08CFA;
    --orange: #B08CFA;
    --band-green: #3ecf5a;
    --band-red: #e8423f;
    --band-purple: #9b5de5;
    --band-blue: #2f8fe0;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    background:var(--bg);
    color:var(--ink);
    font-family:'Open Sans', sans-serif;
    font-weight:400;
    -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:640px;margin:0 auto;padding:0 0 60px;}

  /* HEADER */
  .hero{
    padding:36px 24px 28px;
    background:
      radial-gradient(circle at 15% -10%, rgba(176,140,250,0.18), transparent 55%),
      var(--bg);
    border-bottom:1px solid var(--card-border);
  }
  .brand{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:15px;
    letter-spacing:0.14em;
    color:var(--lime);
    margin:0 0 18px;
  }
  .brand span{color:var(--ink);}
  .hero h1{
    font-family:'Open Sans', sans-serif;
    font-weight:800;
    font-size:34px;
    line-height:1.05;
    margin:0 0 10px;
    text-transform:uppercase;
  }
  .hero h1 em{
    font-style:normal;
    color:var(--lime);
  }
  .hero p.sub{
    color:var(--ink-dim);
    font-size:15px;
    line-height:1.5;
    max-width:52ch;
    margin:0;
  }

  /* INFO STRIP */
  .info-strip{
    display:flex;
    gap:10px;
    padding:18px 24px;
    flex-wrap:wrap;
  }
  .chip{
    flex:1;
    min-width:130px;
    background:var(--card);
    border:1px solid var(--card-border);
    border-radius:12px;
    padding:12px 14px;
  }
  .chip .label{
    font-size:10px;
    letter-spacing:0.1em;
    text-transform:uppercase;
    color:var(--ink-dim);
    margin:0 0 4px;
  }
  .chip .value{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:16px;
    margin:0;
  }
  .chip.accent .value{color:var(--orange);}

  /* DIAGNOSIS CALLOUT */
  .callout{
    margin:6px 24px 8px;
    background:linear-gradient(135deg, rgba(176,140,250,0.12), rgba(176,140,250,0.06));
    border:1px solid var(--card-border);
    border-radius:14px;
    padding:16px 18px;
  }
  .callout .label{
    font-size:11px;
    letter-spacing:0.1em;
    text-transform:uppercase;
    color:var(--lime);
    margin:0 0 6px;
    font-weight:700;
  }
  .callout p{margin:0;color:var(--ink);font-size:14.5px;line-height:1.5;}

  /* SECTION */
  .section{padding:28px 24px 4px;}
  .section-head{
    display:flex;
    align-items:baseline;
    justify-content:space-between;
    margin-bottom:14px;
    border-bottom:2px solid var(--lime);
    padding-bottom:8px;
  }
  .section-head h2{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:15px;
    letter-spacing:0.06em;
    text-transform:uppercase;
    margin:0;
  }
  .section-head span{
    font-size:11px;
    color:var(--ink-dim);
    text-transform:uppercase;
    letter-spacing:0.08em;
  }

  /* EXERCISE CARD */
  .ex-card{
    background:var(--card);
    border:1px solid var(--card-border);
    border-radius:16px;
    padding:16px 16px 14px;
    margin-bottom:12px;
  }
  .ex-top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:12px;
    margin-bottom:8px;
  }
  .ex-name{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:16px;
    line-height:1.25;
    text-transform:uppercase;
    margin:0;
    color:var(--orange);
  }
  .ex-dose{
    flex-shrink:0;
    text-align:right;
  }
  .ex-dose .num{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:20px;
    color:var(--lime);
    line-height:1;
  }
  .ex-dose .unit{
    font-size:10px;
    color:var(--ink-dim);
    text-transform:uppercase;
    letter-spacing:0.06em;
  }
  .ex-cue{
    font-size:13.5px;
    color:var(--ink-dim);
    line-height:1.5;
    margin:6px 0 12px;
  }
  .ex-bottom{
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:10px;
  }
  .band{
    display:inline-flex;
    align-items:center;
    gap:6px;
    font-size:12px;
    color:var(--ink-dim);
  }
  .dot{
    width:10px;height:10px;border-radius:50%;
    display:inline-block;
  }
  .dot.green{background:var(--band-green);}
  .dot.red{background:var(--band-red);}
  .dot.purple{background:var(--band-purple);}
  .dot.blue{background:var(--band-blue);}
  .dot.none{background:transparent;border:1px solid var(--ink-dim);}

  .video-btn{
    display:inline-flex;
    align-items:center;
    gap:6px;
    font-size:12px;
    font-weight:700;
    color:var(--bg);
    background:var(--lime);
    border:none;
    padding:8px 12px;
    border-radius:999px;
    text-decoration:none;
    white-space:nowrap;
  }
  .video-btn:active{opacity:0.8;}

  /* PROGRESS TRACKER */
  .tracker{
    margin:8px 24px 0;
    background:var(--card);
    border:1px solid var(--card-border);
    border-radius:16px;
    padding:18px;
  }
  .tracker h2{
    font-family:'Open Sans', sans-serif;
    font-weight:700;
    font-size:14px;
    text-transform:uppercase;
    margin:0 0 4px;
  }
  .tracker p{font-size:12.5px;color:var(--ink-dim);margin:0 0 14px;}
  .weeks{display:flex;flex-direction:column;gap:10px;}
  .week-row{display:flex;align-items:center;gap:12px;}
  .week-label{font-size:12px;color:var(--ink-dim);width:56px;flex-shrink:0;}
  .boxes{display:flex;gap:8px;}
  .box{
    width:32px;height:32px;
    border:1.5px solid var(--card-border);
    border-radius:8px;
    display:flex;align-items:center;justify-content:center;
    font-size:12px;color:var(--ink-dim);
    cursor:pointer;
    transition:background .15s, border-color .15s;
  }
  .box.checked{
    background:var(--lime);
    border-color:var(--lime);
    color:var(--bg);
    font-weight:800;
  }

  /* FOOTER NOTE */
  .footer-note{
    margin:26px 24px 0;
    padding:16px 18px;
    border:1px dashed var(--card-border);
    border-radius:14px;
  }
  .footer-note p{
    margin:0;
    font-size:13px;
    color:var(--ink-dim);
    line-height:1.6;
  }
  .footer-note strong{color:var(--orange);}

  .signoff{
    text-align:center;
    padding:28px 24px 0;
    color:var(--ink-dim);
    font-size:12px;
    letter-spacing:0.08em;
    text-transform:uppercase;
  }
  .signoff b{color:var(--lime);}
</style>
</head>`;
