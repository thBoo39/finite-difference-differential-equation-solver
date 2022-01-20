function draw_Laplace2D() {
  let n = 8;
  let tol = 5e-4;
  let maxCnt = 20000;

  let conditions = {
    DBC: {
      N: 100,
      E: 50,
      S: 0,
      W: 75
    },
    n: n
  }

  let { u } = createLaplace2D(conditions);
  console.log(u);
  let delta = 1;
  let cnt = 0;
  start = Date.now();
  while (delta > tol && cnt < maxCnt) {
    (delta) = solveLaplace2D(u);
    cnt++;
  }
  console.log(cnt, delta);
  console.log((Date.now() - start) / 1000)

  console.log("Done. Plotting...")
  data = { z: u, type: 'surface' }
  var layout = {
    font: { size: 16 }
  };
  var config = { responsive: true }
  Plotly.newPlot('myDiv', [data], layout, config);

  function createLaplace2D(conditions) {
    let u = [];
    let n = conditions.n;
    u.push(new Array(n).fill(conditions.DBC.N));
    for (i = 1; i < n - 1; i++) {
      u.push(new Array(n).fill(0));
      u[i][0] = conditions.DBC.W;
      u[i][n - 1] = conditions.DBC.E;
    }
    u.push(new Array(n).fill(conditions.DBC.S));
    // corners
    u[0][0] = (u[0][0] + u[1][0]) / 2;
    u[n - 1][0] = (u[n - 1][0] + u[n - 2][0]) / 2;
    u[0][n - 1] = (u[0][n - 1] + u[1][n - 1]) / 2;
    u[n - 1][n - 1] = (u[n - 1][n - 1] + u[n - 2][n - 1]) / 2;
    return { u };
  }

  function solveLaplace2D(u) {
    let maxDelta = 0;
    // use of SOR method with Gauss Seidel method
    let w = 1.8;
    for (j = 1; j < n - 1; j++) {
      for (i = 1; i < n - 1; i++) {
        let oldu = u[j][i];
        u[j][i] = (u[j - 1][i] + u[j + 1][i] + u[j][i - 1] + u[j][i + 1]) / 4;
        u[j][i] = oldu + w * (u[j][i] - oldu);
        let delta = Math.abs(oldu - u[j][i]);
        if (delta > maxDelta) maxDelta = delta;
      }
    }
    return (maxDelta)
  }

  function realF(f, f0, h, totalT) {
    let n = Math.abs(totalT.tn - totalT.t0) / h;
    let x = [];
    let y = [];

    let s;
    for (i = 0; i < n; i++) {
      var t = i * h + totalT.t0;
      s = f(t, f0);
      x.push(t);
      y.push(s);
    }
    return { x: x, y: y };
  }


}

