# Cargivo

## Current State
Admin > Team Members page shows a table with Add/Edit/Deactivate/Reset Password actions. There is no way to view full details of a team member.

## Requested Changes (Diff)

### Add
- "View" button in each team member row that opens a detail modal
- Team Member Detail Modal showing: full profile info (name, email, phone, role, status, assigned state/area), assigned orders from the shared quote store, and a summary of order counts by status

### Modify
- `AdminTeamMembers.tsx`: add view detail button and detail modal inline

### Remove
- Nothing

## Implementation Plan
1. In `AdminTeamMembers.tsx`, add a `viewingMember` state and a detail modal
2. Detail modal shows: member profile card (name, email, phone, state, area, status badge), summary stat cards (total assigned, in progress, completed), and a table of assigned orders pulled from `getQuoteRequests()` filtered by member name
3. Add "View" button to each table row
