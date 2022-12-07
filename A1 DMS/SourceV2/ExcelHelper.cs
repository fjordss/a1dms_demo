using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Drawing;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Spire.Xls;

namespace A1DMS
{
    public class ExcelColumn
    {
        public string Label { get; set; }
        public string InternalName { get; set; }
        public int Width { get; set; }
        public Func<object, string> Map { get; set; }

        public ExcelColumn(string label, string InternalName, Func<object, string> map = null, int width = 20)
        {
            this.Label = label;
            this.InternalName = InternalName;
            this.Map = map;
            this.Width = width;
        }
    }

    public class ExcelHelper
    {
        public static byte[] Create<T>(List<ExcelColumn> columns, IEnumerable<T> rows)
        {
            var type = typeof(T);

            var book = new Workbook();
            var headerStyle = book.Styles.Add("Header");
            headerStyle.Color = Color.PowderBlue;
            headerStyle.Font.IsBold = true;

            var sheet = book.Worksheets[0];

            var filters = sheet.AutoFilters;
            filters.Range = sheet.Range[1, 1, sheet.LastRow, columns.Count];
            filters.Filter();

            var colIndex = 1;
            foreach (var column in columns)
            {
                sheet.SetColumnWidth(colIndex, column.Width);
                sheet.Range[1, colIndex].Style = headerStyle;
                sheet.Range[1, colIndex].Value = column.Label;

                colIndex++;
            }

            var rowIndex = 2;
            foreach (var row in rows)
            {
                colIndex = 0;
                foreach (var column in columns)
                {
                    colIndex++;

                    var property = type.GetProperty(column.InternalName);
                    if (property == null)
                        continue;

                    var value = property.GetValue(row);


                    sheet.Range[rowIndex, colIndex].Value = column.Map != null ? column.Map(value) : (value != null ? value.ToString() : "");
                }

                rowIndex++;
            }

            var ms = new MemoryStream();
            book.SaveToStream(ms, FileFormat.Version2016);

            return ms.ToArray();
        }
    }
}
