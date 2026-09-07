/**
 * Decap CMS — GitHub OAuth: step 1 (redirect to GitHub).
 * Runs as a Cloudflare Pages Function at  /api/auth
 *
 * Requires env vars on the Cloudflare Pages project:
 *   GITHUB_OAUTH_ID      — GitHub OAuth App "Client ID"
 *   GITHUB_OAUTH_SECRET  — GitHub OAuth App "Client secret"  (used in callback.js)
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.GITHUB_OAUTH_ID) {
    return new Response('GITHUB_OAUTH_ID env var is not set on this Pages project.', {
      status: 500,
    });
  }

  const redirectUri = `${url.origin}/api/callback`;
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', 'repo,user:email');
  authorize.searchParams.set('state', crypto.randomUUID());
  authorize.searchParams.set('allow_signup', 'false');

  return Response.redirect(authorize.toString(), 302);
}
