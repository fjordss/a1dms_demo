using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace A1DMS
{
    public class YandexSpellerError
    {
        public int Code { get; set; }
        public int Position { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public int Length { get; set; }

        public string Word { get; set; }

        public List<string> Suggestions { get; set; } = new List<string>();
    }

    public class YandexSpellerResult
    {
        public List<YandexSpellerError> Errors { get; set; } = new List<YandexSpellerError>();
    }

    public class YandexSpeller
    {
        private readonly string ApiUrl = "https://speller.yandex.net/services/spellservice.json/checkTexts";

        public bool IgnoreDigits { get; set; }
        public bool IgnoreUrls { get; set; }
        public bool FindRepeatingWords { get; set; }
        public bool IgnoreCapitalization { get; set; }

        public List<string> SourceTexts { get; set; }
        public List<string> ReplacedTexts { get; set; }
        public List<YandexSpellerResult> Results { get; set; }
        public string Response { get; set; }

        public YandexSpeller()
        {
        }

        public List<YandexSpellerResult> CheckTexts(List<string> texts)
        {
            var options = 0;
            if (this.IgnoreDigits)
                options |= 2;

            if (this.IgnoreUrls)
                options |= 4;

            if (this.FindRepeatingWords)
                options |= 8;

            if (this.IgnoreCapitalization)
                options |= 512;

            var url = this.ApiUrl + "?lang=ru&";
            foreach (var text in texts)
                url += "text=" + HttpUtility.UrlEncode(text) + "&";

            url = url.Trim('&');

            if (options > 0)
                url += "&options=" + options;
            else
                url = url.Trim('&');

            var responseJson = NetHelper.SendGetHttpRequest(url);
            var responseObj = (JArray)JsonConvert.DeserializeObject(responseJson);

            this.SourceTexts = texts;
            this.Response = responseObj.ToString();
            this.Results = this.ParseResult(responseObj);

            return this.Results;
        }

        public List<string> Replace()
        {
            var newTexts = new List<string>();

            for (var i = 0; i < this.Results.Count; i++)
            {
                var text = this.SourceTexts[i];
                for (var j = this.Results[i].Errors.Count - 1; j >= 0; j--)
                {
                    var error = this.Results[i].Errors[j];

                    if (TranslationHelper.GetStringLanguage(error.Word) != Language.Russian)
                        continue;

                    if (error.Code == 1)
                        text = text.Substring(0, error.Position) + error.Suggestions.First() + text.Substring(error.Position + error.Length);
                }

                newTexts.Add(text);
            }

            this.ReplacedTexts = newTexts;

            return this.ReplacedTexts;
        }

        private List<YandexSpellerResult> ParseResult(JArray resultsObj)
        {
            var results = new List<YandexSpellerResult>();
            foreach (JArray resultObj in resultsObj)
            {
                var result = new YandexSpellerResult();
                foreach (JObject errorObj in resultObj)
                {
                    var error = new YandexSpellerError();
                    error.Code = (int)errorObj["code"];
                    error.Position = (int)errorObj["pos"];
                    error.Row = (int)errorObj["row"];
                    error.Column = (int)errorObj["col"];
                    error.Length = (int)errorObj["len"];

                    error.Word = (string)errorObj["word"];

                    foreach (string suggestion in (JArray)errorObj["s"])
                        error.Suggestions.Add(suggestion);

                    result.Errors.Add(error);
                }

                results.Add(result);
            }

            return results;
        }
    }
}
