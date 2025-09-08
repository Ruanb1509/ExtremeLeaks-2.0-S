/*
  # Criar tabela de histórico do usuário

  1. Nova Tabela
    - `user_histories`
      - `id` (integer, primary key, auto increment)
      - `userId` (integer, foreign key para users)
      - `contentId` (integer, foreign key para contents, nullable)
      - `modelId` (integer, foreign key para models, nullable)
      - `action` (enum: view, like, share, download)
      - `metadata` (json, nullable)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Relacionamentos
    - Foreign key para users(id)
    - Foreign key para contents(id)
    - Foreign key para models(id)

  3. Índices
    - Índice no userId
    - Índice na ação
    - Índice composto userId + createdAt
*/

CREATE TABLE IF NOT EXISTS "UserHistories" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "contentId" INTEGER,
  "modelId" INTEGER,
  action VARCHAR(20) NOT NULL CHECK (action IN ('view', 'like', 'share', 'download')),
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user_histories_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_histories_content FOREIGN KEY ("contentId") REFERENCES contents(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_histories_model FOREIGN KEY ("modelId") REFERENCES models(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_histories_user_id ON "UserHistories"("userId");
CREATE INDEX IF NOT EXISTS idx_user_histories_action ON "UserHistories"(action);
CREATE INDEX IF NOT EXISTS idx_user_histories_created_at ON "UserHistories"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_user_histories_user_created ON "UserHistories"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_user_histories_content_id ON "UserHistories"("contentId");
CREATE INDEX IF NOT EXISTS idx_user_histories_model_id ON "UserHistories"("modelId");