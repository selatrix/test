export const HealthCheck = () => (
  <div style={{ fontFamily: 'monospace', fontSize: 14, padding: 20, color: '#00ffff', background: '#080808', minHeight: '100vh' }}>
    {JSON.stringify({ status: 'ok', uptime: true, domain: 'ruined.ink', service: 'ink-site' })}
  </div>
);
