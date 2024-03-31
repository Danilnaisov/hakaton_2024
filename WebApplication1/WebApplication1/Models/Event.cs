namespace WebApplication1.Models
{
    /// <summary>
    /// Класс для хранения информации о событиях
    /// </summary>
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string[] Category { get; set; }
        public string[] Images {  get; set; }
        public string Link { get; set; }
    }
}
