// Simple JWT-like middleware placeholder for Workers.
// In production replace with proper JWT validation and key rotation.

export function requireAuth(request: Request, env: any) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: {'Content-Type':'application/json'} 
    });
  }
  const token = auth.slice(7);
  // For template: accept token 'demo-token' as valid
  if (token !== 'demo-token') {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { 
      status: 403, 
      headers: {'Content-Type':'application/json'} 
    });
  }
  return null; // null means ok
}
