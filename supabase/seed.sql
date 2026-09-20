-- Inserir dados mock se necessário
INSERT INTO organizations (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'EdCria Studio') ON CONFLICT DO NOTHING;
