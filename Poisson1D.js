function draw_Poisson1D() {
  // conditions
  let n = 18;
  let r = 2;
  let x0 = 0;
  let xn = 4;
  let b0 = 4;
  let bn = 4;

  // x values at each node
  let dx = (xn - x0) / n
  let x = new Array(n + 1);
  for (i = 0; i < x.length; i++) { x[i] = x0 + i * dx };

  // matrix A
  let A = [];
  A.push(new Array(n + 1).fill(0));
  A[0][0] = 1;
  for (i = 1; i < n; i++) {
    A.push(new Array(n + 1).fill(0));
    A[i][i - 1] = 1;
    A[i][i] = -2;
    A[i][i + 1] = 1;
  }
  A.push(new Array(n + 1).fill(0));
  A[n][n] = 1;

  // vector b
  let b = new Array(n + 1).fill(r * dx ** 2);
  b[0] = b0;
  b[b.length - 1] = bn;

  // solving u with lusolve from math.js
  let u = math.lusolve(A, b);

  // plot with Plotly.js
  let trace_u = { x: [], y: [] }
  for (let i = 0; i < n + 1; i++) {
    trace_u.x.push(x[i]);
    trace_u.y.push(u[i][0]);
  }
  let layout = {
    yaxis: {
      rangemode: 'tozero'
    }
  }
  Plotly.newPlot('myDiv', [trace_u], layout);
}
