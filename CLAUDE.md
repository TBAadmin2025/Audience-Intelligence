# Claude Code Instructions

Before doing anything else in this repo, read
PROJECT_BRIEF.md for full context on what this
platform is and how it works.

## This Is A Template Repo
The only folder that changes per client build
is src/client/. Never modify any other files
for client-specific content.

## Key Rules
- Never hardcode tenant UUIDs — use TENANT_ID env var
- Never paste credentials in chat
- Always run npm run build after changes
- Always commit and push when build passes

## New Client Build Process
1. Clone this repo and rename for client
2. Replace src/client/ files only
3. Insert tenant row in Supabase tba-client-platform
4. Add env vars to Vercel
5. Push and deploy

## Environment Variables Required
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
GHL_LOCATION_ID
GHL_API_KEY
TENANT_ID
