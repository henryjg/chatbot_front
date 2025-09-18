// EmailEvoltaController.cs
// Controlador para manejar emails específicos de Evolta
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace TuProyecto.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailEvoltaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailEvoltaController> _logger;

        public EmailEvoltaController(IConfiguration configuration, ILogger<EmailEvoltaController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("enviar-evolta")]
        public async Task<IActionResult> EnviarEmailEvolta([FromBody] EvoltaEmailRequest request)
        {
            try
            {
                // Validar datos de entrada
                if (string.IsNullOrWhiteSpace(request.To) || 
                    string.IsNullOrWhiteSpace(request.Subject) || 
                    string.IsNullOrWhiteSpace(request.HtmlBody))
                {
                    return BadRequest(new { success = false, message = "Datos incompletos para envío de email" });
                }

                // Configuración SMTP desde appsettings.json o usar los valores por defecto
                var smtpHost = _configuration["SMTP:Host"] ?? "imperu.com.pe";
                var smtpPort = int.Parse(_configuration["SMTP:Port"] ?? "25");
                var smtpFrom = _configuration["SMTP:From"] ?? "beneficios@imperu.com.pe";
                var smtpFromName = _configuration["SMTP:FromName"] ?? "APPBeneficios IMP";

                // Crear cliente SMTP
                using var smtpClient = new SmtpClient(smtpHost, smtpPort);
                smtpClient.EnableSsl = false; // Ajustar según tu servidor SMTP
                
                // Si tu servidor SMTP requiere autenticación, descomenta y configura:
                // smtpClient.Credentials = new NetworkCredential("usuario", "password");

                // Crear mensaje
                using var mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(request.From ?? smtpFrom, request.FromName ?? smtpFromName);
                mailMessage.To.Add(new MailAddress(request.To, request.ToName ?? request.To));
                mailMessage.Subject = request.Subject;
                mailMessage.Body = request.HtmlBody;
                mailMessage.IsBodyHtml = true;

                // Agregar headers adicionales
                mailMessage.Headers.Add("X-Mailer", "IMP Beneficios System");
                mailMessage.Headers.Add("X-Priority", "3");

                // Enviar email
                await smtpClient.SendMailAsync(mailMessage);

                _logger.LogInformation($"Email Evolta enviado exitosamente a: {request.To}");

                return Ok(new { 
                    success = true, 
                    message = "Email enviado exitosamente",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, $"Error SMTP al enviar email Evolta a {request?.To}");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error del servidor de correo",
                    error = ex.Message 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error general al enviar email Evolta a {request?.To}");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        // Endpoint adicional para verificar la configuración SMTP
        [HttpGet("test-smtp-config")]
        public IActionResult TestSmtpConfig()
        {
            try
            {
                var smtpConfig = new
                {
                    Host = _configuration["SMTP:Host"] ?? "imperu.com.pe",
                    Port = _configuration["SMTP:Port"] ?? "25",
                    From = _configuration["SMTP:From"] ?? "beneficios@imperu.com.pe",
                    FromName = _configuration["SMTP:FromName"] ?? "APPBeneficios IMP"
                };

                return Ok(new { 
                    success = true, 
                    config = smtpConfig,
                    message = "Configuración SMTP cargada correctamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener configuración SMTP");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error al cargar configuración SMTP" 
                });
            }
        }
    }

    // Modelo para recibir datos del frontend
    public class EvoltaEmailRequest
    {
        public string To { get; set; } = string.Empty;
        public string? ToName { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string HtmlBody { get; set; } = string.Empty;
        public string? From { get; set; }
        public string? FromName { get; set; }
    }
}
