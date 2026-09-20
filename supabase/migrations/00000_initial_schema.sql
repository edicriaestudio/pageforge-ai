-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizações
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Membros da Organização
CREATE TABLE organization_members (
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- FK to auth.users
  role TEXT NOT NULL CHECK (role IN ('owner', 'creator', 'reviewer', 'publisher')),
  PRIMARY KEY (org_id, user_id)
);

-- 3. Projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Páginas
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  current_version_id UUID, -- FK adicionada depois
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Versões (Snapshots)
CREATE TABLE page_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  page_spec JSONB NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Circular FK
ALTER TABLE pages ADD CONSTRAINT fk_current_version FOREIGN KEY (current_version_id) REFERENCES page_versions(id) ON DELETE SET NULL;

-----------------------------------------
-- ROW LEVEL SECURITY (RLS)
-----------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Usuário só vê organizações que pertence
CREATE POLICY "user_select_org" ON organizations FOR SELECT USING (
  id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);

-- Usuário só vê membros da própria org
CREATE POLICY "user_select_members" ON organization_members FOR SELECT USING (
  org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);

-- Usuário só lê projetos da sua org
CREATE POLICY "user_select_projects" ON projects FOR SELECT USING (
  organization_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())
);

-- Usuário só lê páginas dos projetos autorizados
CREATE POLICY "user_select_pages" ON pages FOR SELECT USING (
  project_id IN (SELECT id FROM projects WHERE organization_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()))
);

-- Versões
CREATE POLICY "user_select_versions" ON page_versions FOR SELECT USING (
  page_id IN (SELECT id FROM pages WHERE project_id IN (SELECT id FROM projects WHERE organization_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())))
);
