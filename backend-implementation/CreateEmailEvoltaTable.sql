-- SQL Server script para crear tabla de logs de emails Evolta (opcional)
-- Ejecutar en tu base de datos si quieres llevar un registro de emails enviados

CREATE TABLE EmailEvoltaLogs (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,
    EmailTo NVARCHAR(255) NOT NULL,
    EmailToName NVARCHAR(255) NULL,
    Subject NVARCHAR(500) NOT NULL,
    EmailFrom NVARCHAR(255) NOT NULL,
    EmailFromName NVARCHAR(255) NULL,
    SentAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Success BIT NOT NULL DEFAULT 0,
    ErrorMessage NVARCHAR(MAX) NULL,
    EmailType NVARCHAR(50) NULL, -- 'CODIGO_VERIFICACION' o 'BIENVENIDA'
    ClienteDocumento NVARCHAR(20) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Crear índices para optimizar consultas
CREATE INDEX IX_EmailEvoltaLogs_EmailTo ON EmailEvoltaLogs(EmailTo);
CREATE INDEX IX_EmailEvoltaLogs_SentAt ON EmailEvoltaLogs(SentAt);
CREATE INDEX IX_EmailEvoltaLogs_ClienteDocumento ON EmailEvoltaLogs(ClienteDocumento);
CREATE INDEX IX_EmailEvoltaLogs_EmailType ON EmailEvoltaLogs(EmailType);
