/*
  # Criar tabelas de comentários e likes

  1. Nova Tabela Comments
    - `id` (integer, primary key, auto increment)
    - `userId` (integer, foreign key para Users)
    - `contentId` (integer, foreign key para contents, nullable)
    - `modelId` (integer, foreign key para models, nullable)
    - `text` (text, not null)
    - `likes` (integer, default 0)
    - `isActive` (boolean, default true)
    - `createdAt` (timestamp)
    - `updatedAt` (timestamp)

  2. Nova Tabela Likes
    - `id` (integer, primary key, auto increment)
    - `userId` (integer, foreign key para Users)
    - `contentId` (integer, foreign key para contents, nullable)
    - `modelId` (integer, foreign key para models, nullable)
    - `type` (enum: content, model)
    - `createdAt` (timestamp)
    - `updatedAt` (timestamp)

  3. Nova Tabela CommentLikes
    - `id` (integer, primary key, auto increment)
    - `userId` (integer, foreign key para Users)
    - `commentId` (integer, foreign key para Comments)
    - `createdAt` (timestamp)
    - `updatedAt` (timestamp)

  4. Índices e Relacionamentos
    - Índices únicos para evitar duplicatas
    - Foreign keys com cascade apropriado
*/

-- Criar tabela Comments
CREATE TABLE IF NOT EXISTS "Comments" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "contentId" INTEGER,
  "modelId" INTEGER,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0 NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_comments_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_content FOREIGN KEY ("contentId") REFERENCES contents(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_model FOREIGN KEY ("modelId") REFERENCES models(id) ON DELETE CASCADE,
  
  -- Pelo menos um dos dois deve ser fornecido
  CONSTRAINT check_content_or_model_comment CHECK ("contentId" IS NOT NULL OR "modelId" IS NOT NULL)
);

-- Criar tabela Likes
CREATE TABLE IF NOT EXISTS "Likes" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "contentId" INTEGER,
  "modelId" INTEGER,
  type VARCHAR(20) NOT NULL CHECK (type IN ('content', 'model')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_likes_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_content FOREIGN KEY ("contentId") REFERENCES contents(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_model FOREIGN KEY ("modelId") REFERENCES models(id) ON DELETE CASCADE,
  
  -- Índice único para evitar likes duplicados
  CONSTRAINT unique_user_like UNIQUE ("userId", "contentId", "modelId", type)
);

-- Criar tabela CommentLikes
CREATE TABLE IF NOT EXISTS "CommentLikes" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "commentId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_comment_likes_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_likes_comment FOREIGN KEY ("commentId") REFERENCES "Comments"(id) ON DELETE CASCADE,
  
  -- Índice único para evitar likes duplicados em comentários
  CONSTRAINT unique_user_comment_like UNIQUE ("userId", "commentId")
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON "Comments"("userId");
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON "Comments"("contentId");
CREATE INDEX IF NOT EXISTS idx_comments_model_id ON "Comments"("modelId");
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON "Comments"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_comments_active ON "Comments"("isActive");

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON "Likes"("userId");
CREATE INDEX IF NOT EXISTS idx_likes_content_id ON "Likes"("contentId");
CREATE INDEX IF NOT EXISTS idx_likes_model_id ON "Likes"("modelId");
CREATE INDEX IF NOT EXISTS idx_likes_type ON "Likes"(type);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON "CommentLikes"("userId");
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON "CommentLikes"("commentId");