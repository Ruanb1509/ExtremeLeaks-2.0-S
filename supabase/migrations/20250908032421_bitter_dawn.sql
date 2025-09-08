/*
  # Criar tabela de denúncias

  1. Nova Tabela
    - `reports`
      - `id` (integer, primary key, auto increment)
      - `contentId` (integer, foreign key para contents, nullable)
      - `modelId` (integer, foreign key para models, nullable)
      - `userId` (integer, foreign key para users, nullable)
      - `reason` (enum: broken_link, child_content, no_consent, spam, inappropriate, other)
      - `description` (text, nullable)
      - `status` (enum: pending, reviewed, resolved, dismissed)
      - `ipAddress` (string, nullable)
      - `reviewedAt` (timestamp, nullable)
      - `reviewedBy` (integer, nullable)
      - `adminNotes` (text, nullable)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Relacionamentos
    - Foreign key para contents(id)
    - Foreign key para models(id)
    - Foreign key para users(id)

  3. Índices
    - Índice no contentId
    - Índice no modelId
    - Índice no status
    - Índice no motivo
*/

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  "contentId" INTEGER,
  "modelId" INTEGER,
  "userId" INTEGER,
  reason VARCHAR(20) NOT NULL CHECK (reason IN ('broken_link', 'child_content', 'no_consent', 'spam', 'inappropriate', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  "ipAddress" VARCHAR(45),
  "reviewedAt" TIMESTAMP WITH TIME ZONE,
  "reviewedBy" INTEGER,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_reports_content FOREIGN KEY ("contentId") REFERENCES contents(id) ON DELETE CASCADE,
  CONSTRAINT fk_reports_model FOREIGN KEY ("modelId") REFERENCES models(id) ON DELETE CASCADE,
  CONSTRAINT fk_reports_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE SET NULL,
  CONSTRAINT fk_reports_reviewer FOREIGN KEY ("reviewedBy") REFERENCES "Users"(id) ON DELETE SET NULL,
  
  -- Pelo menos um dos dois deve ser fornecido
  CONSTRAINT check_content_or_model CHECK ("contentId" IS NOT NULL OR "modelId" IS NOT NULL)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reports_content_id ON reports("contentId");
CREATE INDEX IF NOT EXISTS idx_reports_model_id ON reports("modelId");
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports("userId");
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reason ON reports(reason);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports("createdAt" DESC);