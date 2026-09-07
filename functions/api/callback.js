/**
 * Decap CMS — GitHub OAuth: step 2 (exchange code, hand token to the CMS).
 * Runs as a Cloudflare Pages Function at  /api/callback
 * This must match the "Authorization callback URL" of the GitHub OAuth App:
 *   https://jastin.xyz/api/callback
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const provider = 'github';

  if (!code) {
    return html(page(provider, 'error', { error: 'No "code" returned by GitHub.' }));
  }

  let payload;
  let status = 'success';
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'decap-oauth-cf',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_ID,
        client_secret: env.GITHUB_OAUTH_SECRET,
        code,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      payload = { token: data.access_token, provider };
    } else {
      status = 'error';
      payload = { error: data.error_description || data.error || 'Token exchange failed', provider };
    }
  } catch (e) {
    status = 'error';
    payload = { error: String(e), provider };
  }

  return html(page(provider, status, payload));
}

function page(provider, status, result) {
  const message = `authorization:${provider}:${status}:${JSON.stringify(result)}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body style="font-family:system-ui;background:#0a0a0a;color:#e8dcc4;display:grid;place-items:center;height:100vh;margin:0">
<p>Menghubungkan ke panel admin… kamu bisa menutup jendela ini.</p>
<script>
(function () {
  var message = ${JSON.stringify(message)};
  function receive(e) {
    window.opener && window.opener.postMessage(message, e.origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:${provider}', '*');
})();
</script>
</body></html>`;
}

function html(body) {
  return new Response(body, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
