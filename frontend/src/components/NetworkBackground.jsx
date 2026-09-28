// A decorative node/edge graph behind the login card — purely visual,
// no data, no dependency beyond what's already in the project (plain
// SVG + CSS). Positions are computed ONCE at module load (not inside
// the component, and not with Math.random() in the render body): the
// login form re-renders on every keystroke, and regenerating random
// positions on each render would make the background visibly jitter
// while someone types their password.
//
// Animation is plain CSS `animation`, deliberately — index.css already
// has a site-wide `@media (prefers-reduced-motion: reduce)` rule that
// zeroes every animation's duration, so this freezes to a static
// layout for free, with no extra logic here.

const VIEW_W = 100
const VIEW_H = 62
const NODE_COUNT = 30
const ACTIVE_COUNT = 5
const EDGE_MAX_DISTANCE = 22 // viewBox units — only connect nodes reasonably close together
const EDGES_PER_NODE = 2

// A tiny linear-congruential PRNG, seeded fixed — NOT for security, just
// so the layout is reproducible across reloads/screenshots instead of a
// fresh shuffle every time (easier to eyeball for "does this look
// right" during review, and avoids ever generating a degenerate layout
// like two overlapping nodes by pure bad luck).
function makeRng(seed) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

function buildGraph() {
  const rng = makeRng(20260929)
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    x: rng() * VIEW_W,
    y: rng() * VIEW_H,
    r: 0.55 + rng() * 0.5,
    delay: rng() * 4,
  }))

  const activeIds = new Set()
  while (activeIds.size < ACTIVE_COUNT) {
    activeIds.add(Math.floor(rng() * NODE_COUNT))
  }

  const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`)
  const edgeSet = new Map()
  for (const node of nodes) {
    const distances = nodes
      .filter((other) => other.id !== node.id)
      .map((other) => ({ other, d: Math.hypot(other.x - node.x, other.y - node.y) }))
      .filter(({ d }) => d <= EDGE_MAX_DISTANCE)
      .sort((a, b) => a.d - b.d)
      .slice(0, EDGES_PER_NODE)
    for (const { other } of distances) {
      edgeSet.set(edgeKey(node.id, other.id), [node, other])
    }
  }

  return { nodes, activeIds, edges: [...edgeSet.values()] }
}

const GRAPH = buildGraph()

export function NetworkBackground() {
  return (
    <svg
      className="login-network"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <g className="login-network__drift">
        {GRAPH.edges.map(([a, b]) => (
          <line
            key={`${a.id}-${b.id}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className={
              GRAPH.activeIds.has(a.id) || GRAPH.activeIds.has(b.id)
                ? 'login-network__edge login-network__edge--active'
                : 'login-network__edge'
            }
          />
        ))}
        {GRAPH.nodes.map((node) => {
          const active = GRAPH.activeIds.has(node.id)
          return (
            <g key={node.id}>
              {active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r * 3}
                  className="login-network__node-glow"
                  style={{ animationDelay: `${node.delay}s` }}
                  filter="url(#nodeGlow)"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                className={active ? 'login-network__node login-network__node--active' : 'login-network__node'}
                style={{ animationDelay: `${node.delay}s` }}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
