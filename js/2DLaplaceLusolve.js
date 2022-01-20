function draw_Laplace2D_Lusolve() {
  const GRID_WIDTH = 8
  const DIRICHLET = {
    NORTH: 100,
    EAST: 50,
    SOUTH: 0,
    WEST: 75
  }

  let startTime = Date.now();
  let { A, b } = create2DLaplaceMatrices(GRID_WIDTH, DIRICHLET);
  let inner_u = math.lusolve(A, b);
  let u = reshape(inner_u, GRID_WIDTH, DIRICHLET);
  console.log(Date.now() - startTime);
  plotSurface(u);
}
function create2DLaplaceMatrices(GRID_WIDTH, DIRICHLET) {
  const INNER_GRID_WIDTH = GRID_WIDTH - 2;
  const NUMBER_OF_SOLUTIONS = (INNER_GRID_WIDTH) * (INNER_GRID_WIDTH);
  let solutionIndex = 0;
  let A = [];
  let b = new Array(NUMBER_OF_SOLUTIONS).fill(0);
  for (j = 0; j < INNER_GRID_WIDTH; j++) {
    for (i = 0; i < INNER_GRID_WIDTH; i++) {
      A.push(new Array(NUMBER_OF_SOLUTIONS).fill(0));
      solutionIndex = i + (j) * (INNER_GRID_WIDTH);
      A[solutionIndex][solutionIndex] = -4;
      if (i == 0) {
        b[solutionIndex] -= DIRICHLET.WEST;
      } else {
        A[solutionIndex][solutionIndex - 1] = 1
      }
      if (j == 0) {
        b[solutionIndex] -= DIRICHLET.SOUTH;
      } else {
        A[solutionIndex][solutionIndex - (INNER_GRID_WIDTH)] = 1;
      }
      if (i == (INNER_GRID_WIDTH - 1)) {
        b[solutionIndex] -= DIRICHLET.EAST;
      } else {
        A[solutionIndex][solutionIndex + 1] = 1;
      }
      if (j == (INNER_GRID_WIDTH - 1)) {
        b[solutionIndex] -= DIRICHLET.NORTH;
      } else {
        A[solutionIndex][solutionIndex + (INNER_GRID_WIDTH)] = 1;
      }
    }
  }
  return { A, b };
}

function reshape(inner_u, GRID_WIDTH, DIRICHLET) {
  const INNER_GRID_WIDTH = GRID_WIDTH - 2;
  let u = [];
  u.push(new Array(GRID_WIDTH).fill(DIRICHLET.SOUTH));
  while (inner_u.length) u.push((inner_u.splice(0, INNER_GRID_WIDTH)).flat());
  for (j = 1; j < GRID_WIDTH - 1; j++) {
    u[j].splice(0, 0, DIRICHLET.WEST);
    u[j].splice(u[j].length, 0, DIRICHLET.EAST);
  }
  u.push(new Array(GRID_WIDTH).fill(DIRICHLET.NORTH));
  u[0][0] = (u[0][1] + u[1][0]) / 2;
  u[0][GRID_WIDTH - 1] = (u[0][GRID_WIDTH - 2] + u[1][GRID_WIDTH - 1]) / 2;
  u[GRID_WIDTH - 1][0] = (u[GRID_WIDTH - 2][0] + u[GRID_WIDTH - 1][1]) / 2;
  u[GRID_WIDTH - 1][GRID_WIDTH - 1] = (u[GRID_WIDTH - 2][GRID_WIDTH - 1] + u[GRID_WIDTH - 1][GRID_WIDTH - 2]) / 2;
  return u;
}

function plotSurface(u) {
  let data = { z: u, type: 'surface' };
  let layout = {
    font: { size: 16 }
  };
  let config = { responsive: true };
  Plotly.newPlot('myDiv', [data], layout, config);
}

