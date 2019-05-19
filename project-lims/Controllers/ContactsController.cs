using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;

using Lims.Models;
using Lims.Managers;

namespace Lims
{
    [CustomExceptionFilter]
    public class ContactsController : Controller
    {
        private ContactsManager manager;
        public ContactsController(ContactsManager manager)
        {
            this.manager = manager;
        }

        [HttpGet("[controller]/")]
        public async Task<IActionResult> GetAll()
        {
            return Json(await manager.GetAllContacts());
        }

        [HttpGet("[controller]/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            return Json(await manager.Get(id));
        }

        [HttpGet("Customers/")]
        public async Task<List<CustomerModel>> GetAllCustomers()
        {
            return await manager.GetAllCustomers();
        }
    }

    public class CustomerController : Controller
    {

    }
}