using System;
using Microsoft.AspNetCore.Mvc;

namespace Lims
{
    public class Homecontroller : Controller
    {
        public Homecontroller()
        {

        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}