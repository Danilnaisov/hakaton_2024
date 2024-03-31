using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Globalization;
using System.Xml;
using WebApplication1.Data;
using WebApplication1.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApplication1.Services
{
    public interface IParseService
    {
        void Parse();
    }
    public class ParseService : IParseService
    {
        public async void Parse()
        {
            EventContext AllEvents = new EventContext();
            var list = AllEvents.Events.ToList();
            var new_list = new List<Event>();
            HttpClient client = new HttpClient();
            string content = await client.GetStringAsync("https://perm.ticketland.ru/search/performance/");

            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(content);

            //Берём нижний компонент с переходом по страницам, берём из него атрибут "количество страниц" и присваиваем значение
            int pageCount = Convert.ToInt32(doc.DocumentNode.SelectSingleNode("//li[@data-js='page-last']").GetAttributeValue("data-page-count", ""));
            //Цикл, чтобы бегать по страницам
            HtmlDocument document = new HtmlDocument();
            for (int i = 1; i <= pageCount; i++)
            {
                content = await client.GetStringAsync("https://perm.ticketland.ru/search/performance/?page=" + i);
                doc.LoadHtml(content);
                //Взяли элементы
                var events = doc.DocumentNode.SelectNodes("//div[@class='card-search card-search--show']");
                //Цикл, который прогоняет каждый элемент на странице
                foreach (var even in events)
                {
                    Event _event = new Event();
                    string href = "https://perm.ticketland.ru" + even.ChildNodes[1].ChildNodes[1].GetAttributeValue("href", "");
                    content = await client.GetStringAsync(href);
                    document.LoadHtml(content);


                    _event.Name = even.ChildNodes[3].ChildNodes[1].ChildNodes[1].InnerText.Replace("\t", "").Replace("\n", "");
                    _event.Description = document.DocumentNode.SelectSingleNode("//div[@itemprop='description']").InnerText.Replace("\n", "").Replace("  ", "");
                    _event.Image = even.ChildNodes[1].ChildNodes[1].ChildNodes[1].GetAttributeValue("data-src", "");
                    _event.Images = [_event.Image, _event.Image, _event.Image];
                    string category = even.ChildNodes[3].ChildNodes[5].ChildNodes[1].ChildNodes[1].InnerText.Replace("Спектакли", "Театр");
                    _event.Category = category.Split(", ");
                    var time = even.ChildNodes[3].ChildNodes[5].ChildNodes[1].ChildNodes[3].ChildNodes[3].ChildNodes[0].InnerText.Replace("\t", "").Replace("\n", "").Replace("&nbsp;", " ");
                    time = time.Replace("сен", "сент").Replace("ноя", "нояб");
                    time += time.Contains("мая") ? "" : ".";
                    time += " " + even.ChildNodes[3].ChildNodes[5].ChildNodes[1].ChildNodes[3].ChildNodes[3].ChildNodes[3].InnerText.Replace("&bull;", "");

                    DateTime date = DateTime.Now;
                    if (DateTime.TryParseExact(time, "d MMM H:m", new CultureInfo("ru-RU"), DateTimeStyles.None, out date))
                    {
                        _event.Date = date.ToString("dd.MM.yyyy");
                        _event.Time = date.ToString("HH:mm");
                    }
                    var test = document.DocumentNode.SelectSingleNode($"//article[@data-day='{date.ToString("dd")}' and @data-month='{date.ToString("MM").Replace("0", "")}' and @data-year='{date.ToString("yy")}']//a");
                    if (test == null)
                    {
                        test = document.DocumentNode.SelectSingleNode($"//article[@data-day='{date.ToString("dd")}' and @data-month='{date.ToString("MM")}' and @data-year='{date.ToString("yy")}']//a");
                    }
                    _event.Link = "https://perm.ticketland.ru" + test.GetAttributeValue("href", "");
                    new_list.Add(_event);
                }
            }
            for (int j = 1; j < 4; j++)
            {
                try
                {

                    content = await client.GetStringAsync($"https://ticket4me.ru/perm/afisha/kino?page={j}");

                    doc.LoadHtml(content);

                    var items = doc.DocumentNode.SelectNodes("//div[@class='event-item list-item clearfix']");
                    if (items != null)
                    {
                        foreach (var item in items)
                        {
                            Event _event = new Event();
                            string name = item.ChildNodes[1].ChildNodes[0].ChildNodes[0].InnerText.
                                Replace("\n", "").
                                Replace("\t", "");
                            _event.Name = name;

                            _event.Category = ["Кино"];

                            string time = item.ChildNodes[1].ChildNodes[2].InnerText.
                                Replace("\n", "").
                                Replace("\t", "")
                                .Trim().
                                Replace(" марта ", ".03.2024").
                                Replace(" апреля ", ".04.2024").
                                Replace(" мая ", ".05.2024").
                                Replace(" июня ", ".06.2024").
                                Replace(" июля ", ".07.2024").
                                Replace(" августа ", ".08.2024").
                                Replace("Ближайший сеанс сегодня в", "31.03.2024").
                                Replace("Ближайший сеанс", "").
                                Replace("Сегодня", "31.03.2024").
                                Replace("в", "").
                                Replace(" 1.", "01.").
                                Replace(" 2.", "02.").
                                Replace(" 3.", "03.").
                                Replace(" 4.", "04.").
                                Replace(" 5.", "05.").
                                Replace(" 6.", "06.").
                                Replace(" 7.", "07.").
                                Replace(" 8.", "08.").
                                Replace(" 9.", "09.");
                            if (time[0] == ' ')
                                time = time.Remove(0, 1);
                            var data = time.Split(" ");
                            _event.Date = data[0];
                            _event.Time = data[1];

                            string image = item.ChildNodes[0].GetAttributeValue("style", "").
                                Replace("background-image: url('", "").
                                Replace("');", "").
                                Replace("\n", "").
                                Replace("\t", "");
                            _event.Image = image;
                            _event.Images = [image, image, image];
                            string link = item.ChildNodes[1].ChildNodes[0].ChildNodes[0].GetAttributeValue("href", "");
                            //запрос на другую страницу сайта для изъятия текста

                            content = await client.GetStringAsync($"{link}");

                            document.LoadHtml(content);

                            var items1 = document.DocumentNode.SelectNodes("//p[@class='cinema-desc']");
                            string text = "";
                            if (items1 != null)
                            {
                                text = items1[0].InnerText.Trim();
                            }
                            _event.Link = link;
                            _event.Description = text;
                            new_list.Add(_event);
                        }
                    }

                }
                catch
                {
                    break;
                }
            }
            for (int i = 0; i < list.Count; i++)
            {
                new_list.Remove(new_list.Find(x => x.Name == list[i].Name));
            }
            if (new_list.Count != 0)
            {
                //Уведомление в ТГ
                foreach (var item in new_list)
                {
                    await AllEvents.Events.AddAsync(item);
                }
            }
            AllEvents.SaveChanges();
        }
    }
}
