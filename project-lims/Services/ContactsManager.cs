using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
//using System.Linq;

using Lims.Models;

namespace Lims.Managers
{
    public class ContactsManager
    {
        private LimsContext db;
        public ContactsManager(LimsContext db) 
        {
            this.db = db;
        }

        public async Task<List<CustomerModel>> GetAllCustomers()
        {
            return await db.Customers.ToListAsync();
        }

        public async Task<CustomerModel> GetCustomer(int id)
        {
            return await db.Customers.SingleAsync( c => c.Id == id );
        }

            public async Task<List<ContactModel>> GetAllContacts()
        {
            return await db.Contacts.ToListAsync();
        }
        public async Task<ContactModel> Get(int id)
        {
            return await db.Contacts.SingleAsync( c => c.Id == id );//.Include( c => c.Customer ).SingleAsync(c => c.Id == id);
        }

        //Insert & Update
        public async Task<ManagerActionResult<int>> SaveContact(ContactModel model)
        {
            var result = new ManagerActionResult<int> { IsSuccess = true, Result = 1 };
            if(model.Id > 0)
            {
                try
                {
                    var contact = await db.Contacts.SingleAsync( c => c.Id == model.Id );
                    contact.Name = model.Name;
                    contact.PhoneNumber = model.PhoneNumber;
                }
                catch(Exception ex)
                {
                    result.IsSuccess = false;
                    result.Message = ex.Message;
                }
            }
            else
            {
                try
                {
                    db.Contacts.Add(model);
                    result.IsSuccess = true;
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Message = ex.Message;
                }
            }

            if(result.IsSuccess)
            {
                db.SaveChanges();
                result.Result = model.Id;
            }

            return result;
        }
    }

    public class ManagerActionResult<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
    }
}