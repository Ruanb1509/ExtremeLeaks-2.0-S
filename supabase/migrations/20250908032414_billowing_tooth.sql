/*
  # Criar tabela de conteúdos

  1. Nova Tabela
    - `contents`
      - `id` (integer, primary key, auto increment)
      - `modelId` (integer, foreign key para models)
      - `title` (string, not null)
      - `url` (string, not null)
      - `thumbnailUrl` (string, nullable)
      - `type` (enum: video, image, gallery)
      - `tags` (json, nullable)
      - `views` (integer, default 0)
      - `status` (enum: active, broken, reported, removed)
      - `language` (string, default 'en')
      - `isActive` (boolean, default true)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Relacionamentos
    - Foreign key para models(id)

  3. Índices
    - Índice no modelId
    - Índice no status
    - Índice nas visualizações
*/

CREATE TABLE IF NOT EXISTS contents (
  id SERIAL PRIMARY KEY,
  "modelId" INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  "thumbnailUrl" VARCHAR(500),
  type VARCHAR(20) DEFAULT 'image' CHECK (type IN ('video', 'image', 'gallery')),
  tags JSONB DEFAULT '[]',
  views INTEGER DEFAULT 0 NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'broken', 'reported', 'removed')),
  language VARCHAR(10) DEFAULT 'en',
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_contents_model FOREIGN KEY ("modelId") REFERENCES models(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contents_model_id ON contents("modelId");
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_views ON contents(views DESC);
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_contents_active ON contents("isActive");
CREATE INDEX IF NOT EXISTS idx_contents_tags ON contents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);