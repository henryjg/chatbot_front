// EmailEvoltaService.cs
// Servicio adicional con logging a base de datos (opcional)
using System.Net.Mail;
using System.Net;

namespace TuProyecto.Services
{
    public interface IEmailEvoltaService
    {
        Task<bool> EnviarEmailEvoltaAsync(EvoltaEmailRequest request, string? clienteDocumento = null, string? emailType = null);
        Task<List<EmailEvoltaLog>> ObtenerHistorialEmailsAsync(string? emailTo = null, DateTime? desde = null, DateTime? hasta = null);
    }

    public class EmailEvoltaService : IEmailEvoltaService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailEvoltaService> _logger;
        private readonly string _connectionString;

        public EmailEvoltaService(IConfiguration configuration, ILogger<EmailEvoltaService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<bool> EnviarEmailEvoltaAsync(EvoltaEmailRequest request, string? clienteDocumento = null, string? emailType = null)
        {
            var success = false;
            var errorMessage = string.Empty;
            var sentAt = DateTime.UtcNow;

            try
            {
                // Validar datos
                if (string.IsNullOrWhiteSpace(request.To) || 
                    string.IsNullOrWhiteSpace(request.Subject) || 
                    string.IsNullOrWhiteSpace(request.HtmlBody))
                {
                    throw new ArgumentException("Datos incompletos para envío de email");
                }

                // Configuración SMTP
                var smtpHost = _configuration["SMTP:Host"] ?? "imperu.com.pe";
                var smtpPort = int.Parse(_configuration["SMTP:Port"] ?? "25");
                var smtpFrom = _configuration["SMTP:From"] ?? "beneficios@imperu.com.pe";
                var smtpFromName = _configuration["SMTP:FromName"] ?? "APPBeneficios IMP";
                var enableSsl = bool.Parse(_configuration["SMTP:EnableSsl"] ?? "false");
                var useAuth = bool.Parse(_configuration["SMTP:UseAuthentication"] ?? "false");

                using var smtpClient = new SmtpClient(smtpHost, smtpPort);
                smtpClient.EnableSsl = enableSsl;

                // Configurar autenticación si es necesaria
                if (useAuth)
                {
                    var username = _configuration["SMTP:Username"];
                    var password = _configuration["SMTP:Password"];
                    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                    {
                        smtpClient.Credentials = new NetworkCredential(username, password);
                    }
                }

                // Crear mensaje
                using var mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(request.From ?? smtpFrom, request.FromName ?? smtpFromName);
                mailMessage.To.Add(new MailAddress(request.To, request.ToName ?? request.To));
                mailMessage.Subject = request.Subject;
                mailMessage.Body = request.HtmlBody;
                mailMessage.IsBodyHtml = true;

                // Headers adicionales
                mailMessage.Headers.Add("X-Mailer", "IMP Beneficios Evolta System");
                mailMessage.Headers.Add("X-Email-Type", emailType ?? "GENERAL");
                if (!string.IsNullOrEmpty(clienteDocumento))
                {
                    mailMessage.Headers.Add("X-Cliente-Documento", clienteDocumento);
                }

                // Enviar email
                await smtpClient.SendMailAsync(mailMessage);
                success = true;

                _logger.LogInformation($"Email Evolta enviado exitosamente a: {request.To}, Tipo: {emailType}");
            }
            catch (Exception ex)
            {
                success = false;
                errorMessage = ex.Message;
                _logger.LogError(ex, $"Error al enviar email Evolta a {request?.To}");
            }
            finally
            {
                // Guardar log en base de datos (opcional)
                if (!string.IsNullOrEmpty(_connectionString))
                {
                    await GuardarLogEmailAsync(request, success, errorMessage, sentAt, clienteDocumento, emailType);
                }
            }

            return success;
        }

        public async Task<List<EmailEvoltaLog>> ObtenerHistorialEmailsAsync(string? emailTo = null, DateTime? desde = null, DateTime? hasta = null)
        {
            var logs = new List<EmailEvoltaLog>();
            
            if (string.IsNullOrEmpty(_connectionString))
            {
                return logs;
            }

            try
            {
                // Aquí implementarías la consulta a la base de datos
                // Ejemplo con Entity Framework o ADO.NET
                _logger.LogInformation($"Consultando historial de emails. EmailTo: {emailTo}, Desde: {desde}, Hasta: {hasta}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener historial de emails Evolta");
            }

            return logs;
        }

        private async Task GuardarLogEmailAsync(EvoltaEmailRequest request, bool success, string errorMessage, DateTime sentAt, string? clienteDocumento, string? emailType)
        {
            try
            {
                // Implementar guardado en base de datos
                // Ejemplo de query SQL:
                /*
                var sql = @"
                    INSERT INTO EmailEvoltaLogs 
                    (EmailTo, EmailToName, Subject, EmailFrom, EmailFromName, SentAt, Success, ErrorMessage, EmailType, ClienteDocumento)
                    VALUES 
                    (@EmailTo, @EmailToName, @Subject, @EmailFrom, @EmailFromName, @SentAt, @Success, @ErrorMessage, @EmailType, @ClienteDocumento)
                ";
                */
                
                _logger.LogInformation($"Log guardado para email a: {request.To}, Success: {success}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al guardar log de email Evolta");
            }
        }
    }

    // Modelo para logs de emails
    public class EmailEvoltaLog
    {
        public long Id { get; set; }
        public string EmailTo { get; set; } = string.Empty;
        public string? EmailToName { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string EmailFrom { get; set; } = string.Empty;
        public string? EmailFromName { get; set; }
        public DateTime SentAt { get; set; }
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public string? EmailType { get; set; }
        public string? ClienteDocumento { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
