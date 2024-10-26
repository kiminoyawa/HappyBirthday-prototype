var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

var cwidth, cheight;
var shells = [];
var pass = [];

// Blue and purple color palette for fireworks
var colors = ['#448AFF', '#40C4FF', '#536DFE', '#7C4DFF', '#651FFF', '#6200EA', '#673AB7', '#3D5AFE'];
var bgColors = ['#0f2027', '#203a43', '#2c5364', '#1a1a1a', '#001f3f', '#000', '#2F4F4F', '#483D8B'];

window.onresize = function() { reset(); }
reset();
function reset() {
  cwidth = window.innerWidth;
  cheight = window.innerHeight;
  c.width = cwidth;
  c.height = cheight;
}

function newShell() {
  var left = (Math.random() > 0.5);
  var shell = {};
  shell.x = (1 * left);
  shell.y = 1;
  shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
  shell.yoff = 0.01 + Math.random() * 0.007;
  shell.size = Math.random() * 6 + 3;
  shell.color = colors[Math.floor(Math.random() * colors.length)];

  shells.push(shell);
}

function newPass(shell) {
  var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

  for (i = 0; i < pasCount; i++) {
    var pas = {};
    pas.x = shell.x * cwidth;
    pas.y = shell.y * cheight;

    var a = Math.random() * 4;
    var s = Math.random() * 10;

    pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
    pas.yoff = s * Math.sin(a * (Math.PI / 2));

    pas.color = shell.color;
    pas.size = Math.sqrt(shell.size);

    if (pass.length < 1000) { pass.push(pas); }
  }
  
  // Change background color randomly when a firework explodes
  document.body.style.background = bgColors[Math.floor(Math.random() * bgColors.length)];
}

var lastRun = 0;
Run();
function Run() {
  var dt = 1;
  if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
  lastRun = performance.now();

  // Clear canvas with transparent black to create a trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, cwidth, cheight);

  if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }

  for (let ix in shells) {
    var shell = shells[ix];

    // Draw neon glow effect for shells
    ctx.beginPath();
    ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
    ctx.fillStyle = shell.color;
    ctx.shadowBlur = 20; // Glow effect
    ctx.shadowColor = shell.color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow blur for next object

    shell.x -= shell.xoff;
    shell.y -= shell.yoff;
    shell.xoff -= (shell.xoff * dt * 0.001);
    shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);

    if (shell.yoff < -0.005) {
      newPass(shell);
      shells.splice(ix, 1);
    }
  }

  for (let ix in pass) {
    var pas = pass[ix];

    // Draw neon glow effect for particles
    ctx.beginPath();
    ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
    ctx.fillStyle = pas.color;
    ctx.shadowBlur = 15; // Glow effect for particles
    ctx.shadowColor = pas.color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow blur for next object

    pas.x -= pas.xoff;
    pas.y -= pas.yoff;
    pas.xoff -= (pas.xoff * dt * 0.001);
    pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
    pas.size -= (dt * 0.002 * Math.random());

    if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
      pass.splice(ix, 1);
    }
  }
  requestAnimationFrame(Run);
}
