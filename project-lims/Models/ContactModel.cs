

using System;
using System.Collections.Generic;

using Newtonsoft.Json;

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lims.Models
{

    [Table("Contacts")]
    public class ContactModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        //foreigns
        public int CustomerId { get; set; }


        [ForeignKey("CustomerId")]
        [JsonIgnore]
        public CustomerModel Customer { get; set; }
        
        [InverseProperty("ReceivedFrom")]
        [JsonIgnore]
        public List<PurchaseOrderRequestModel> PurchaseOrderRequests { get; set; }
    }

    [Table("Customers")]
    public class CustomerModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }

        [InverseProperty("Customer")]
        [JsonIgnore]
        public List<ContactModel> Contacts { get; set; }
    }

    public class LimsUser : IdentityUser<int>
    {

        [InverseProperty("ReceivedBy")]
        public List<SampleModel> Samples { get; set; }
        [InverseProperty("SubmittedBy")]
        public List<SampleTestParameterResultModel> SampleTestParameterResults { get; set; }

        [InverseProperty("SubmittedBy")]
        public List<PurchaseOrderRequestModel> PurchaseOrderRequests { get; set; }
    }

    public class LimsRole : IdentityRole<int>
    {

    }

    public class LimsUserClaim : IdentityUserClaim<int>
    {
        //public LimsUser User { get; set; }
    }

    public class LimsUserRole : IdentityUserRole<int>
    {
        
    }
}