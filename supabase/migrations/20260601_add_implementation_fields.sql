-- Add implementation tracking fields to ai_proposals
ALTER TABLE ai_proposals
  ADD COLUMN IF NOT EXISTS implementation_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS implementation_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS implementation_finished_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS implementation_log TEXT;

-- Index for finding pending implementations
CREATE INDEX IF NOT EXISTS idx_proposals_impl_status ON ai_proposals (implementation_status) WHERE status = 'approved';
