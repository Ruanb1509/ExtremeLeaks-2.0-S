/*
  # Atualizar tabela de usuários

  1. Novas Colunas
    - `isVerified` (boolean, default false)
    - `verificationToken` (string, nullable)
    - `resetPasswordToken` (string, nullable)
    - `resetPasswordExpires` (timestamp, nullable)
    - `language` (string, default 'en')
    - `country` (string, nullable)
    - `ageConfirmed` (boolean, default false)
    - `lastLoginAt` (timestamp, nullable)

  2. Índices
    - Índice no token de verificação
    - Índice no token de reset
    - Índice no idioma
*/

-- Adicionar novas colunas se não existirem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'isVerified'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "isVerified" BOOLEAN DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'verificationToken'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "verificationToken" VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'resetPasswordToken'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "resetPasswordToken" VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'resetPasswordExpires'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "resetPasswordExpires" TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'language'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN language VARCHAR(10) DEFAULT 'en';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'country'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN country VARCHAR(10);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'ageConfirmed'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "ageConfirmed" BOOLEAN DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'lastLoginAt'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "lastLoginAt" TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON "Users"("verificationToken");
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON "Users"("resetPasswordToken");
CREATE INDEX IF NOT EXISTS idx_users_language ON "Users"(language);
CREATE INDEX IF NOT EXISTS idx_users_verified ON "Users"("isVerified");
CREATE INDEX IF NOT EXISTS idx_users_last_login ON "Users"("lastLoginAt");