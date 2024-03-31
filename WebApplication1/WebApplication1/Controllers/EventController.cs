using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/EventController")]
    public class EventController : Controller
    {
        [EnableCors("_myAllowSpecificOrigins")]
        [Route("List")]
        [HttpGet]
        [ProducesResponseType(typeof(List<Event>),200)]
        [ProducesResponseType(500)]
        public ActionResult List()
        {
            try
            {
                IEnumerable<Event> events = new EventContext().Events;
                return Json(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        [EnableCors("_myAllowSpecificOrigins")]
        [Route("Item")]
        [HttpGet]
        [ProducesResponseType(typeof(Event), 200)]
        [ProducesResponseType(500)]
        public ActionResult Item(int id)
        {
            try
            {
                Event _event = new EventContext().Events.Where(x => x.Id == id).First();
                return Json(_event);
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }
    }
}
