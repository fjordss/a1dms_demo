using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using A1DMS;

namespace MailSender
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> Logger;

        public Worker(ILogger<Worker> logger)
        {
            this.Logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            this.Logger.LogInformation("Worker started");

            var queue = new Queue(QueueType.Mail, Program.Configuration);
            queue.MessagesCount = 5;

            if (queue.IsValid)
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    this.Logger.LogInformation("Trying to receive messages");

                    var eMailMessages = queue.ReceiveMessages<EMailMessage>();
                    if (eMailMessages == null)
                    {
                        await Task.Delay(5000, stoppingToken);
                        continue;
                    }

                    this.Logger.LogInformation(eMailMessages.Count + " messages received");

                    foreach (var eMailMessage in eMailMessages)
                    {
                        if (eMailMessage.Message != null)
                        {
                            var result = this.HandleMessage(eMailMessage.Message);
                            if (result)
                                this.DeleteMessage(eMailMessage);
                        }
                        else
                        {
                            this.Logger.LogError("Failed to parse EMailMessage from message");

                            this.DeleteMessage(eMailMessage);
                        }
                    }
                }
            }
            else
                this.Logger.LogError("Queue is not valid");

            this.Logger.LogInformation("Worker completed");
        }

        protected bool HandleMessage(EMailMessage message)
        {
            if (!message.Validate())
            {
                if (message.Recepients == null || message.Recepients.Count == 0)
                    this.Logger.LogError("Recepients list is empty");
                else if (message.Recepients.Any(r => string.IsNullOrEmpty(r)))
                    this.Logger.LogError("One or more recepients are empty");

                if (string.IsNullOrEmpty(message.Subject))
                    this.Logger.LogError("Subject of the message is empty");

                if (string.IsNullOrEmpty(message.Body))
                    this.Logger.LogError("Body of the message is empty");
            }

            try
            {
                this.Logger.LogInformation("Trying to send EMail");

                this.SendMessage(message);

                this.Logger.LogInformation("Email successfully sent");
                return true;
            }
            catch (Exception E)
            {
                this.Logger.LogError("Failed to send email, " + E.Message);
                return false;
            }
        }

        protected void SendMessage(EMailMessage message)
        {
            var config = Program.Configuration.GetSection("EMail");

            MailMessage mailMessage = new MailMessage();
            mailMessage.IsBodyHtml = true;

            mailMessage.From = new MailAddress("enlskh@rbs1.ru");

            message.Recepients.ForEach(r => mailMessage.To.Add(r));

            mailMessage.Subject = message.Subject;
            mailMessage.Body = message.Body;

            using (var client = new SmtpClient(config["SMTPHost"], 587))
            {
                client.Credentials = new NetworkCredential(config["SMTPUser"], config["SMTPPassword"]);
                client.EnableSsl = true;

                client.Send(mailMessage);
            }
        }

        protected void DeleteMessage(QueueMessage<EMailMessage> message)
        {
            this.Logger.LogInformation("Trying to delete message");

            var result = message.Queue.DeleteMessage(message);
            if (result)
                this.Logger.LogInformation("Message successfully deleted");
            else
                this.Logger.LogError("Failed to delete message");
        }
    }
}
