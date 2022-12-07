using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace A1DMS
{
    public class YandexTranslator : ITranslationProvider
    {
        private readonly string ApiUrl = "";
        private readonly string TokenUrl = "";
        private readonly string OAuthToken = "";
        private readonly string FolderId = "";

        public string IAMToken { get; private set; }
        public string Query { get; private set; }

        private Dictionary<Language, string> LanguageCodes = new Dictionary<Language, string>()
        {
            { Language.English, "en" },
            { Language.Russian, "ru" },
        };

        internal YandexTranslator()
        {
            this.IAMToken = this.GetIAMToken();
        }

        public string Translate(LanguagePair pair, string text)
        {
            return this.Translate(pair, new List<string>() { text }).First();
        }

        public List<string> Translate(LanguagePair pair, List<string> texts)
        {
            var obj = new JObject();
            obj["folder_id"] = this.FolderId;
            obj["sourceLanguageCode"] = this.LanguageCodes[pair.From];
            obj["targetLanguageCode"] = this.LanguageCodes[pair.To];
            obj["texts"] = new JArray(texts);

            this.Query = obj.ToString();

            var response = NetHelper.SendJsonHttpRequest(this.ApiUrl, this.Query, this.IAMToken);
            obj = (JObject)JsonConvert.DeserializeObject(response);

            var translationsList = ((JArray)obj["translations"]).ToObject<List<JObject>>();

            return translationsList.ConvertAll(t => (string)t["text"]);
        }

        public Dictionary<string, string> Translate(LanguagePair pair, Dictionary<string, string> namedTexts)
        {
            var list = namedTexts.ToList();

            var texts = this.Translate(pair, list.Select(k => k.Value).ToList());

            var translations = new Dictionary<string, string>();
            for (var i = 0; i < list.Count; i++)
                translations[list[i].Key] = texts[i];

            return translations;
        }

        private string GetIAMToken()
        {
            var response = NetHelper.SendJsonHttpRequest(this.TokenUrl, "{ \"yandexPassportOauthToken\": \"" + this.OAuthToken + "\" }");

            return (string)((JObject)JsonConvert.DeserializeObject(response))["iamToken"];
        }
    }
}
