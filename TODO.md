# Deployment TODO (Render.com)

- [ ] Create PostgreSQL database instance on Render (name it `story-db` or match configuration)
- [ ] Create backend Web Service on Render (Node.js) using entry `backend/server.js` and start command `npm start`
- [ ] Set environment variables on the backend service:
  - [ ] `DATABASE_URL` from Render Postgres
  - [ ] (optional) `PORT` if needed
- [ ] Run provided SQL schema on first deploy:
  - [ ] Use Render “Run Migration” / migration hook OR add a migration script that executes `schema.sql` at startup.
  - [ ] Ensure schema runs exactly as provided.
- [x] Deploy schema automatically on Render (via `preDeployCommand` using `schema.sql`)
- [ ] Deploy and verify endpoints:
  - [ ] `GET /api/stories`
  - [ ] frontend loads and calls API successfully (`API_URL='/api'` same-origin)
- [ ] Report final backend URL (frontend served from same URL)


