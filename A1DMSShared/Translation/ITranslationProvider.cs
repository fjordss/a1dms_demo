using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public enum TranslationProvider
    {
        Yandex,
        Bing,
        Google,
        Amazon
    }

    public enum Language
    {
        Russian,
        English
    }

    public struct LanguagePair
    {
        public LanguagePair(Language from, Language to)
        {
            this.From = from;
            this.To = to;
        }

        public Language From { get; set; }
        public Language To { get; set; }
    }

    public class TranslationException : Exception
    {
        public TranslationException() : base() { }

        public TranslationException(string message) : base(message) { }

        public TranslationException(string message, Exception innerException) : base(message, innerException) { }
    }

    public interface ITranslationProvider
    {
        public static ITranslationProvider GetProvider(TranslationProvider provider)
        {
            if (provider == TranslationProvider.Yandex)
                return new YandexTranslator();
            else if (provider == TranslationProvider.Bing)
                return new BingTranslator();

            throw new NotSupportedException();
        }

        public string Translate(LanguagePair pair, string text);

        public List<string> Translate(LanguagePair pair, List<string> texts);

        public Dictionary<string, string> Translate(LanguagePair pair, Dictionary<string, string> namedTexts);
    }
}
