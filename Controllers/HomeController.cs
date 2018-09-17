using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Prerendering;

namespace Travlr.WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISpaPrerenderer _spaPrerender;

        public HomeController(ISpaPrerenderer spaPrerenderer)
        {
            _spaPrerender = spaPrerenderer;
        }

        public async Task<IActionResult> Index()
        {
            var result = await _spaPrerender.RenderToString("ClientApp/renderOnServer");

            Response.StatusCode = (result.StatusCode ?? 200);

            return Content(result.Html, "text/html; charset=UTF-8");
        }
    }
}
