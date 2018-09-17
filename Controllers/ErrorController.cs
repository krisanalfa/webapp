using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Travlr.WebApp.Controllers
{
    public class ErrorController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ErrorController(IHostingEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            var pathToJson = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot", "dist", "manifest.json");
            var manifest = JsonConvert.DeserializeObject<Dictionary<string, string>>(
                System.IO.File.ReadAllText(pathToJson)
            );
            var preloadStyles = manifest.Keys
                .Where(key => (new Regex(@"^[0-9]-[a-z0-9]{10}\.css$")).IsMatch(key))
                .Select(key => manifest[key]);

            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            ViewData["Manifest"] = manifest;
            ViewData["PreloadStyles"] = preloadStyles;

            Response.StatusCode = 500;

            return View();
        }
    }
}
