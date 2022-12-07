using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace A1DMS
{
    public class CommonHelper
    {
        public static async Task<bool> ValidateReCaptcha(string token)
        {
            try
            {
                var client = new HttpClient();

                var content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "secret", "" },
                    { "response", token }
                });

                var response = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);

                var obj = (JObject)JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());

                return (bool)obj["success"];
            }
            catch (Exception E)
            {
                return true;
            }
        }

        public static Dictionary<string, string> Translate(Dictionary<string, string> texts, string language, Dictionary<string, string> glossary = null, Dictionary<string, string> query = null)
        {
            var token = (string)((JObject)JsonConvert.DeserializeObject(NetHelper.SendJsonHttpRequest("", "{ \"yandexPassportOauthToken\": \"\" }")))["iamToken"];

            var kvp = texts.ToList();

            var obj = new JObject();
            obj["folder_id"] = "";
            obj["sourceLanguageCode"] = language == "ru" ? "en" : "ru";
            obj["targetLanguageCode"] = language;
            obj["texts"] = new JArray(kvp.Select(k => k.Value));

            if (glossary != null) 
            {
                var pairs = new JArray();
                foreach (var pair in glossary)
                {
                    var pairObj = new JObject();
                    pairObj["sourceText"] = language == "ru" ? pair.Key : pair.Value;
                    pairObj["translatedText"] = language == "ru" ? pair.Value : pair.Key;

                    pairs.Add(pairObj);
                }

                var data = new JObject();
                data["glossaryPairs"] = pairs;

                var config = new JObject();
                config["glossaryData"] = data;

                obj["glossaryConfig"] = config;
            }

            if (query != null)
                query["Query"] = obj.ToString();

            obj = (JObject)JsonConvert.DeserializeObject(NetHelper.SendJsonHttpRequest("https://translate.api.cloud.yandex.net/translate/v2/translate", obj.ToString(), token));

            var translationsList = ((JArray)obj["translations"]).ToObject<List<JObject>>();
            var translations = new Dictionary<string, string>();
            for (var i = 0; i < kvp.Count; i++)
                translations[kvp[i].Key] = (string)translationsList[i]["text"];

            return translations;
        }

        public static string GetRoles(UserRole role)
        {
            var count = typeof(UserRole).GetFields(BindingFlags.Public | BindingFlags.Static).Length;

            var sum = (int)role;

            var roles = new List<UserRole>();
            for (var i = 0; i < count; i++)
            {
                var current = (int)Math.Pow(2, i);
                if ((sum & current) == current)
                    roles.Add((UserRole)current);
            }

            return string.Join(", ", roles.Select(r => CommonHelper.GetEnumDisplayName(r)));
        }

        public static string GetEnumDisplayName<T>(T _enum) where T : Enum
        {
            var name = _enum.ToString();

            var member = _enum
                .GetType()
                .GetMember(_enum.ToString());

            var attribute = member.First().GetCustomAttribute<DisplayAttribute>();

            return attribute != null ? attribute.Name : name;
        }

        public static T GetEnumByDisplayName<T>(string displayName) where T : struct
        {
            var fields = typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static);

            foreach (var field in fields)
            {
                var attribute = field.GetCustomAttribute<DisplayAttribute>();
                if (attribute != null && attribute.Name == displayName)
                    return Enum.Parse<T>(field.Name);
            }

            if (fields.Any(f => f.Name == displayName))
                return Enum.Parse<T>(displayName);

            return default(T);
        }

        public static bool ValidateEMail(string eMail)
        {
            return Regex.IsMatch(eMail, @"^[a-zA-Z\d]?[a-zA-Z\d\-_\.]*[a-zA-Z\d]{1}@[a-zA-Z\d]?[a-zA-Z\d\.\-]*[a-zA-Z\d]{1}\.[a-zA-Z]+$");
        }
    }
}
