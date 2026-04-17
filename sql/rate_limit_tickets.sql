-- ============================================================================
-- RATE LIMITING: Máximo 5 tickets por minuto por usuario
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. Función que valida el rate limit antes de INSERT
CREATE OR REPLACE FUNCTION check_ticket_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    ticket_count INTEGER;
    max_tickets_per_minute CONSTANT INTEGER := 5;
    window_interval CONSTANT INTERVAL := '1 minute';
BEGIN
    -- Contar tickets creados por este usuario en el último minuto
    SELECT COUNT(*)
    INTO ticket_count
    FROM tickets
    WHERE created_by = NEW.created_by
      AND created_at >= (NOW() - window_interval);

    -- Si excede el límite → rechazar INSERT
    IF ticket_count >= max_tickets_per_minute THEN
        RAISE EXCEPTION 'Rate limit excedido: máximo % tickets por minuto. Intenta de nuevo en unos segundos.',
            max_tickets_per_minute
        USING ERRCODE = 'P0001',       -- Código de error personalizado
              HINT = 'rate_limit_exceeded';
    END IF;

    -- Si no excede → permitir INSERT
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que ejecuta la validación ANTES de cada INSERT
DROP TRIGGER IF EXISTS trg_ticket_rate_limit ON tickets;

CREATE TRIGGER trg_ticket_rate_limit
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION check_ticket_rate_limit();

-- ============================================================================
-- VERIFICACIÓN: Probar que funciona
-- ============================================================================
-- Descomentar para probar manualmente:
--
-- INSERT INTO tickets (title, created_by, group_id, status, priority)
-- VALUES ('Test 1', 'USER_UUID', 'GROUP_UUID', 'Pendiente', 'Media');
-- ... repetir 5 veces → la 6ta debe fallar con:
-- "Rate limit excedido: máximo 5 tickets por minuto"

-- ============================================================================
-- OPCIONAL: Rate limit en Auth (login) — Trigger en audit_logs
-- ============================================================================

-- CREATE OR REPLACE FUNCTION check_login_rate_limit()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     attempt_count INTEGER;
-- BEGIN
--     IF NEW.action = 'login_attempt' THEN
--         SELECT COUNT(*)
--         INTO attempt_count
--         FROM audit_logs
--         WHERE user_id = NEW.user_id
--           AND action = 'login_attempt'
--           AND created_at >= (NOW() - INTERVAL '5 minutes');
--
--         IF attempt_count >= 10 THEN
--             RAISE EXCEPTION 'Demasiados intentos de login. Espera 5 minutos.'
--             USING ERRCODE = 'P0001';
--         END IF;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
