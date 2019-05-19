using Microsoft.AspNetCore.Mvc;

namespace Lims
{
    public class ResultsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}