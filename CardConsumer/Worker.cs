using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using A1DMS;
using Microsoft.EntityFrameworkCore.Query;
using System.Resources;

namespace CardConsumer
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> Logger;
        private readonly IServiceProvider ServiceProvider;
        private Context db;

        public Worker(ILogger<Worker> Logger, IServiceProvider ServiceProvider)
        {
            this.Logger = Logger;
            this.ServiceProvider = ServiceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            this.Logger.LogInformation("Worker started");

            using (var scope = this.ServiceProvider.CreateScope())
            {
                this.db = scope.ServiceProvider.GetRequiredService<Context>();

                var queue = new Queue(QueueType.Card, Program.Configuration);
                queue.MessagesCount = 5;

                if (queue.IsValid)
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        this.Logger.LogInformation("Trying to receive messages");

                        var cardMessages = queue.ReceiveMessages<NGHCard>();
                        if (cardMessages == null)
                        {
                            await Task.Delay(5000, stoppingToken);
                            continue;
                        }

                        this.Logger.LogInformation(cardMessages.Count + " messages received");
                        foreach (var cardMessage in cardMessages)
                        {
                            if (cardMessage != null)
                            {
                                var Result = this.CreateCard(cardMessage.Message);
                                if (Result)
                                    this.DeleteMessage(cardMessage);
                            }
                            else
                            {
                                this.Logger.LogError("Failed to parse Card from message");

                                this.DeleteMessage(cardMessage);
                            }
                        }
                    }
                }
                else
                    this.Logger.LogError("Queue is not valid");
            }

            this.Logger.LogInformation("Worker completed");
        }

        protected bool CreateCard(NGHCard card)
        {
            try
            {
                this.Logger.LogInformation("Trying to create NGH Card");

                this.db.Add(card);
                this.db.SaveChanges();

                this.Logger.LogInformation("NGH Card successfully created");

                card = this.db.NGHCards.Where(c => c.Id == card.Id).FirstOrDefault();

                if (card.FurtherActionsRequired)
                    this.CreateActionItem(card);

                this.DetectLanguage(card);

                try
                {
                    this.SpellCheck(card);

                    this.Logger.LogInformation("Spell successfully checked in");
                }
                catch (Exception E)
                {
                    this.Logger.LogError("Failed to check spell");
                }

                try
                {
                    this.Translate(card);

                    this.Logger.LogInformation("Data successfully translated");
                }
                catch (Exception E)
                {
                    this.Logger.LogError("Failed to translate data");
                }

                this.db.Update(card);
                this.db.SaveChanges();

                return true;
            }
            catch (Exception E)
            {
                this.Logger.LogError("Unexpected error, " + E.Message);
                return false;
            }
        }

        protected void CreateActionItem(NGHCard card)
        {
            this.Logger.LogInformation("Trying to create action item");

            var actionItem = new ActionItem();
            actionItem.NGHCard = card;
            actionItem.NGHCardId = card.Id;
            actionItem.Status = ActionItemStatus.Open;

            card.ActionItem = actionItem;

            this.db.ActionItems.Add(actionItem);
        }

        protected void DetectLanguage(NGHCard card)
        {
            card.DescriptionOriginalLang = TranslationHelper.GetStringLanguage(card.Description);
            card.ActionsTakenOriginalLang = TranslationHelper.GetStringLanguage(card.ActionsTaken);

            if (!string.IsNullOrEmpty(card.SpecificLocation))
                card.SpecificLocationOriginalLang = TranslationHelper.GetStringLanguage(card.SpecificLocation);

            if (!string.IsNullOrEmpty(card.SuggestedFurtherActions))
                card.SuggestedFurtherActionsOriginalLang = TranslationHelper.GetStringLanguage(card.SuggestedFurtherActions);
        }

        protected void SpellCheck(NGHCard card)
        {
            var types = new List<int>();
            var texts = new List<string>();
            if (card.DescriptionOriginalLang == Language.Russian)
            {
                texts.Add(card.Description);
                types.Add(1);
            }

            if (card.ActionsTakenOriginalLang == Language.Russian)
            {
                texts.Add(card.ActionsTaken);
                types.Add(2);
            }

            if (card.SpecificLocationOriginalLang == Language.Russian)
            {
                texts.Add(card.SpecificLocation);
                types.Add(3);
            }

            if (card.SuggestedFurtherActionsOriginalLang == Language.Russian)
            {
                texts.Add(card.SuggestedFurtherActions);
                types.Add(4);
            }

            var speller = new YandexSpeller();
            speller.CheckTexts(texts);

            var replacedTexts = speller.Replace();

            for (var i = 0; i < replacedTexts.Count; i++)
            {
                if (texts[i] == replacedTexts[i])
                    continue;

                if (types[i] == 1)
                    card.DescriptionOriginal = replacedTexts[i];

                if (types[i] == 2)
                    card.ActionsTakenOriginal = replacedTexts[i];

                if (types[i] == 3)
                    card.SpecificLocationOriginal = replacedTexts[i];

                if (types[i] == 4)
                    card.SuggestedFurtherActionsOriginal = replacedTexts[i];
            }
        }

        protected void Translate(NGHCard card)
        {
            this.Logger.LogInformation("Trying to translate card information");

            var ruTexts = new Dictionary<string, string>();
            var enTexts = new Dictionary<string, string>();

            if (!string.IsNullOrEmpty(card.Description))
                (card.DescriptionOriginalLang == Language.English ? enTexts : ruTexts).Add("Description", card.Description);

            if (!string.IsNullOrEmpty(card.ActionsTaken))
                (card.ActionsTakenOriginalLang == Language.English ? enTexts : ruTexts).Add("ActionsTaken", card.ActionsTaken);

            if (!string.IsNullOrEmpty(card.SuggestedFurtherActions))
                (card.SuggestedFurtherActionsOriginalLang == Language.English ? enTexts : ruTexts).Add("SuggestedFurtherActions", card.SuggestedFurtherActions);

            if (!string.IsNullOrEmpty(card.SpecificLocation))
                (card.SpecificLocationOriginalLang == Language.English ? enTexts : ruTexts).Add("SpecificLocation", card.SpecificLocation);


            var provider = Enum.Parse<TranslationProvider>(Program.Configuration["TranslationProvider"]);
            var translator = ITranslationProvider.GetProvider(provider);

            var cardType = typeof(NGHCard);
            if (ruTexts.Count > 0)
            {
                foreach (var kvp in translator.Translate(new LanguagePair(Language.Russian, Language.English), ruTexts))
                {
                    var Property = cardType.GetProperty(kvp.Key);
                    cardType.GetProperty(kvp.Key + "Rus").SetValue(card, Property.GetValue(card));
                    Property.SetValue(card, kvp.Value);
                }
            }

            if (enTexts.Count > 0)
            {
                foreach (var kvp in translator.Translate(new LanguagePair(Language.English, Language.Russian), enTexts))
                    cardType.GetProperty(kvp.Key + "Rus").SetValue(card, kvp.Value);
            }
        }

        protected void DeleteMessage(QueueMessage<NGHCard> message)
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
