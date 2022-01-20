function draw_Laplace1D() {
  // conditions
  let N = 10;
  let x0 = 0;
  let xN = 10;
  let b0 = 0;
  let bN = 10;

  // x values at each node
  let dx = (xN - x0) / N;
  let x = new Array(N + 1);
  for (i = 0; i < x.length; i++) { x[i] = x0 + i * dx };

  // matrix A
  let A = [];
  A.push(new Array(N + 1).fill(0));
  A[0][0] = 1;
  for (i = 1; i < N; i++) {
    A.push(new Array(N + 1).fill(0));
    A[i][i - 1] = 1;
    A[i][i] = -2;
    A[i][i + 1] = 1;
  }
  A.push(new Array(N + 1).fill(0));
  A[N][N] = 1;

  // vector b
  let b = new Array(N + 1).fill(0);
  b[0] = b0;
  b[b.length - 1] = bN;

  // solving u with lusolve from math.js
  let u = math.lusolve(A, b);

  // plot with Plotly.js
  let trace_u = { x: [], y: [] }
  for (let i = 0; i < N + 1; i++) {
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