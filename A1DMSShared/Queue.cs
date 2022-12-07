using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Amazon;
using Amazon.Runtime;
using Amazon.SQS;
using Amazon.SQS.Model;
using Microsoft.Extensions.Configuration;
using Amazon.Internal;
using System.Security.Policy;

namespace A1DMS
{
    public delegate Queue CallQueue(QueueType type);

    public enum QueueType
    {
        Card,
        Mail
    }

    public class QueueMessage<T>
    {
        public Queue Queue { get; set; }
        public T Message { get; set; }
        public string ReceiptHandle { get; set; }
    }

    public class Queue
    {
        public bool IsValid { get; set; }
        public QueueType Type { get; private set; }

        public int MessagesCount { get; set; } = 10;

        private AmazonSQSClient Client;
        private string Url;
        private string AccessKey;
        private string SecretKey;

        private bool Initialized;

        public Queue(QueueType type, string url, string accessKey, string secretKey)
        {
            this.Type = type;

            this.Url = url;
            this.AccessKey = accessKey;
            this.SecretKey = secretKey;
        }

        public Queue(QueueType type, IConfiguration configuration)
        {
            this.Type = type;

            var queues = configuration.GetSection("Queues");

            this.Url = queues[this.Type.ToString() + "QueueUrl"];
            this.AccessKey = queues["AccessKey"];
            this.SecretKey = queues["SecretKey"];

            this.Initialize();
        }

        public void Initialize()
        {
            if (!string.IsNullOrEmpty(this.Url))
            {
                var uri = new Uri(this.Url);
                this.Client = new AmazonSQSClient(new BasicAWSCredentials(this.AccessKey, this.SecretKey), new AmazonSQSConfig()
                {
                    ServiceURL = uri.Scheme + Uri.SchemeDelimiter + uri.Host,
                    RegionEndpoint = RegionEndpoint.EUCentral1
                });

                this.IsValid = true;
                this.Initialized = true;
            }
        }

        public bool SendMessage<T>(T message)
        {
            return this.SendMessage(JsonConvert.SerializeObject(message));
        }

        public bool SendMessage(string message)
        {
            if (!this.Initialized)
                this.Initialize();

            try
            {
                var request = new SendMessageRequest();
                request.QueueUrl = this.Url;
                request.MessageBody = message;
    
                var response = this.Client.SendMessageAsync(request).Result;

                return true;
            }
            catch(Exception E)
            {
                return false;
            }
        }

        public List<QueueMessage<T>> ReceiveMessages<T>()
        {
            var messages = this.ReceiveMessages();

            if (messages == null)
                return null;

            var converted = messages.ConvertAll(m => new QueueMessage<T>()
            {
                Queue = m.Queue,
                ReceiptHandle = m.ReceiptHandle
            });

            for (var i = 0; i < messages.Count; i++)
            {
                try
                {
                    converted[i].Message = JsonConvert.DeserializeObject<T>(messages[i].Message);
                }
                catch (Exception e)
                {

                }
            }

            return converted;
        }

        public List<QueueMessage<string>> ReceiveMessages()
        {
            if (!this.Initialized)
                this.Initialize();

            try
            {
                var request = new ReceiveMessageRequest();
                request.MaxNumberOfMessages = this.MessagesCount;
                request.QueueUrl = this.Url;

                var response = this.Client.ReceiveMessageAsync(request).Result;
                if (response.Messages.Count > 0)
                {
                    return response.Messages.ConvertAll(m => new QueueMessage<string>()
                    {
                        Queue = this,
                        Message = m.Body,
                        ReceiptHandle = m.ReceiptHandle
                    });
                }

                return new List<QueueMessage<string>>();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public bool DeleteMessage<T>(QueueMessage<T> message)
        {
            return this.DeleteMessage(message.ReceiptHandle);
        }

        public bool DeleteMessage(string receiptHandle)
        {
            if (!this.Initialized)
                this.Initialize();

            try
            {
                var request = new DeleteMessageRequest();
                request.QueueUrl = this.Url;
                request.ReceiptHandle = receiptHandle;

                var response = this.Client.DeleteMessageAsync(request).Result;

                return true;
            }
            catch (Exception E)
            {
                return false;
            }
        }
    }
}
