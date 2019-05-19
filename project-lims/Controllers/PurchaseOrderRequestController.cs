
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

using AutoMapper;

using Lims.Models;
using Lims.Managers;
using Lims.ViewModels;
using Lims.TransferModels;

namespace Lims
{
    public class PurchaseOrderRequestsController : Controller
    {
        private ILogger logger;
        private SamplesManager samples;
        private LimsContext Db;
        public PurchaseOrderRequestsController(ILogger<PurchaseOrderRequestsController> logger, SamplesManager samples, LimsContext db)
        {
            this.samples = samples;
            this.logger = logger;
            this.Db = db;
        }

        /* Purchase Order Action Methods */
        /* GET RETURN ViewModels */
        [HttpGet("[controller]/")]
        public async Task<IActionResult> GetAll()
        {
            logger.LogWarning("GET: All Purchase Orders");
            return Json(Mapper.Map<List<PurchaseOrderRequestModel>, List<PurchaseOrderRequestViewModel>>(await samples.GetPurchaseOrderRequests()));
        }

        [HttpGet("[controller]/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            logger.LogWarning($"GET: Purchase Order Id: {id}");
            return Json(await samples.GetPurchaseOrderRequest(id));
        }

        /* POST/PUT Accept TransferModels RETURN ID */
        [HttpPost("[controller]/")]
        public async Task<IActionResult> Post([FromBody]PurchaseOrderRequestTransferModel purchaseOrder )
        {
            logger.LogWarning($"POST Purchase Order Code: {purchaseOrder.Code} , ContactId: {purchaseOrder.ContactId} , ReceivedDate: {purchaseOrder.ReceivedDate.ToShortDateString()}");
            int porId = 0;
            using (var transaction = await Db.Database.BeginTransactionAsync())
            {
                try
                {
                    porId = await samples.SavePurchaseOrderRequest(Mapper.Map<PurchaseOrderRequestTransferModel, PurchaseOrderRequestModel>(purchaseOrder));
                    transaction.Commit();
                }
                catch(Exception ex) { transaction.Rollback(); throw ex; }
            }
            
            return Json(porId);
        }
        [HttpPut("[controller]/")]
        public IActionResult Put([FromBody]PurchaseOrderRequestTransferModel purchaseOrder)
        {
            logger.LogWarning($"PUT: Purchase Order Id: {purchaseOrder.Id}");
            return Json("");
        }

        /* DELETE Accept ID RETURN BOOL */
        [HttpDelete("[controller]/{purchaseOrderId:int}")]
        public async Task<IActionResult> Delete(int purchaseOrderId)
        {
            logger.LogWarning($"DELETE: Purchase Order Id: {purchaseOrderId}");
            await samples.DeletePurchaseOrderRequest(purchaseOrderId);
            return Json(new {});
        }



        /* Quotation */
        [HttpGet("[controller]/{id:int}/Quotation")]
        public async Task<IActionResult> GetPurchaseOrderRequestQuotation(int id)
        {
            logger.LogWarning( "GET: Purchase Order Quotation" );
            return Json(await samples.GetPurchaseOrderRequestQuotation(id));
        }

        /* Samples */
        [HttpGet("[controller]/{id:int}/Samples")]
        public async Task<IActionResult> GetPurchaseOrderRequestSamples(int id)
        {
            logger.LogWarning( "GET: Purchase Order Samples" );
            return Json(await samples.GetByPurchaseOrderRequestId(id));
        }
    }
}