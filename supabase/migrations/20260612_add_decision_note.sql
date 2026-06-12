-- Add decision_note column to ai_proposals.
-- The /api/ai-firma/proposals POST handler (Aurelius decision) writes a decision
-- reason, but the column never existed in the schema → every approve/reject would
-- fail with "column ai_proposals.decision_note does not exist" (HTTP 500).
ALTER TABLE ai_proposals
  ADD COLUMN IF NOT EXISTS decision_note TEXT;
