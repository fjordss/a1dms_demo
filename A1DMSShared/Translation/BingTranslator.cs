using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace A1DMS
{
    public class BingTranslator : ITranslationProvider
    {
        private readonly string ApiUrl = "";
        private readonly string ApiKey = "";
        private readonly string ApiRegion = "";

        private Dictionary<Language, string> LanguageCodes = new Dictionary<Language, string>()
        {
            { Language.English, "en" },
            { Language.Russian, "ru" },
        };

        internal BingTranslator()
        {
        }

        public string Translate(LanguagePair pair, string text)
        {
            return this.Translate(pair, new List<string>() { text }).First();   
        }

        public List<string> Translate(LanguagePair pair, List<string> texts)
        {
            try
            {
                var url = this.ApiUrl + $"/translate?api-version=3.0&from={this.LanguageCodes[pair.From]}&to={this.LanguageCodes[pair.To]}";

                var headers = new Dictionary<string, string>();
                headers.Add("Ocp-Apim-Subscription-Key", this.ApiKey);
                headers.Add("Ocp-Apim-Subscription-Region", this.ApiRegion);

                var json = new JArray();
                texts.ForEach(t => json.Add(new JObject() { { "Text", t } }));

                var response = NetHelper.SendJsonHttpRequest(url, JsonConvert.SerializeObject(json), null, headers);

                var obj = JsonConvert.DeserializeObject(response);

                if (obj is JArray)
                {
                    var translations = new List<string>();
                    foreach (JObject TranObj in (JArray)((JArray)obj).ToObject<List<JObject>>().First()["translations"])
                        translations.Add((string)TranObj["text"]);

                    return translations;
                }
                else
                    throw new TranslationException((string)((JObject)obj)["error"]["message"]);
            }
            catch (Exception e)
            {
                throw new TranslationException("Please see inner exception for details", e);
            }
        }

        public Dictionary<string, string> Translate(LanguagePair pair, Dictionary<string, string> namedTexts)
        {
            var list = namedTexts.ToList();

            var texts = this.Translate(pair, list.Select(k => k.Value).ToList());

            var Translations = new Dictionary<string, string>();
            for (var i = 0; i < list.Count; i++)
                Translations[list[i].Key] = texts[i];

            return Translations;
        }
    }
}
