

using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

using AutoMapper;

using Lims.BaseModels;
using Lims.Models;
using Lims.ViewModels;
using Lims.TransferModels;

namespace Lims.Managers
{
    public class SamplesManager
    {
        private LimsContext db;
        private ILogger logger;
        private SamplesManager(LimsContext db)
        {
            this.db = db;
        }

        public SamplesManager(LimsContext db, IServiceProvider provider) : this(db)
        {
            this.logger = provider.GetService<ILoggerFactory>().CreateLogger("Samples Manager");
        }

        public async Task<List<SampleModel>> GetByPurchaseOrderRequestId(int purchaseOrderRequestId)
        {
            return (await db.PurchaseOrderRequests.Include( p => p.Samples ).SingleAsync( p => p.Id == purchaseOrderRequestId )).Samples;
        }


        /* Purchase Request Methods */
        public async Task<List<PurchaseOrderRequestModel>> GetPurchaseOrderRequests()
        {
            return await db.PurchaseOrderRequests.Include( p => p.Quotation )
                                                 .Include( p => p.Samples )
                                                    .ThenInclude( s => s.SampleTestParameters )
                                                        .ThenInclude( t => t.Method )
                                                 .Include( p => p.Samples )
                                                    .ThenInclude( s => s.SampleTestParameters )
                                                        .ThenInclude( t => t.TestParameter )
                                                 .Include( p => p.ReceivedFrom )
                                                    .ThenInclude( r => r.Customer ).ToListAsync();
        }

        public async Task<List<PurchaseOrderRequestModel>> GetPurchaseOrderRequest(int id)
        {
            return await db.PurchaseOrderRequests.ToListAsync();
        }

        public async Task<List<PurchaseOrderRequestModel>> GetPurchaseOrderRequestBySampleId(int sampleId)
        {
            return await db.PurchaseOrderRequests.ToListAsync();
        }

        public async Task<QuotationModel> GetPurchaseOrderRequestQuotation(int purchaseOrderRequestId)
        {
            if(! (await db.PurchaseOrderRequests.AnyAsync( p => p.Id == purchaseOrderRequestId )) ) throw new Exception("Purchase Order doesn't exist");
            return (await db.PurchaseOrderRequests.Include( p => p.Quotation ).SingleAsync( p => p.Id == purchaseOrderRequestId )).Quotation;
        }

        public async Task<int> SavePurchaseOrderRequest(PurchaseOrderRequestModel model)
        {

            if(model.Id == 0)
            {
                // var samples = model.Samples;
                // var quotation = model.Quotation;
                // model.Samples = null;
                // model.Quotation = null;
                // model.ReceivedFrom = null;
                // model.SubmittedBy = null;
                model.SubmittedById = 1;

                //add ModifiedPrice if missing from TestParameterMehtod reverting to the default price. and add PORId
                if(model.Samples != null)
                {
                    foreach(SampleModel sample in model.Samples)
                    {
                        //sample.PurchaseOrderRequestId = model.Id;
                        // var testParameters = sample.SampleTestParameters;
                        // sample.SampleTestParameters = null;
                        sample.ReceivedByUserId = 1;
                        // await db.Samples.AddAsync(sample);
                        // await db.SaveChangesAsync();

                        if(sample.SampleTestParameters == null) continue;
                        foreach(SampleTestParameterModel testParameter in sample.SampleTestParameters)
                        {
                            testParameter.SampleId = sample.Id;
                            TestParameterMethodModel testParameterMethod = await db.TestParameterMethods.SingleAsync( t => t.TestParameterId == testParameter.TestParameterId && t.MethodId == testParameter.MethodId );
                            testParameter.TestParameterMethodId = testParameterMethod.Id;
                            if(testParameter.ModifiedPrice <= 0) testParameter.ModifiedPrice = testParameterMethod.Price;
                        }

                        // await db.SampleTestParameters.AddRangeAsync(testParameters);
                        // await db.SaveChangesAsync();
                    }
                }

                db.PurchaseOrderRequests.Add(model);
                await db.SaveChangesAsync();
            }
            else
            {
                var origModel = await db.PurchaseOrderRequests.Include( p => p.Samples ).Include( p => p.Quotation ).SingleAsync( p => p.Id == model.Id );
                //what is this ??
                origModel = model;
            }
            //await db.SaveChangesAsync();
            return model.Id;
        }

        

        public async Task DeletePurchaseOrderRequest(int purchaseOrderRequestId)
        {
            var model = await db.PurchaseOrderRequests.SingleOrDefaultAsync( p => p.Id == purchaseOrderRequestId );

            if(model != null && model.Id != 0)
            {
                db.PurchaseOrderRequests.Remove(model);
                await db.SaveChangesAsync();
            }
        }


        /* SAMPLES */
        public async Task<List<SampleModel>> GetSamples()
        {
            return await db.Samples.Include( s => s.PurchaseOrderRequest )
                                        .ThenInclude( p => p.ReceivedFrom )
                                            .ThenInclude( c => c.Customer )
                                    .Include( s => s.Matrix ).ToListAsync();
                                            
                                    // .Include( s => s.SampleTestParameters )
                                    //     .ThenInclude( t => t.TestParameter )
                                    // .Include( s => s.SampleTestParameters )
                                    //     .ThenInclude( t => t.Method ).ToListAsync();
        }

        public async Task<SampleModel> GetSample(int id)
        {
            return await db.Samples.Include( s => s.PurchaseOrderRequest )
                                        .ThenInclude( p => p.ReceivedFrom )
                                            .ThenInclude( c => c.Customer )
                                            
                                    .Include( s => s.Matrix )
                                            
                                    .Include( s => s.SampleTestParameters )
                                        .ThenInclude( t => t.TestParameter )
                                    .Include( s => s.SampleTestParameters )
                                        .ThenInclude( t => t.Method )
                                    .Include( s => s.SampleTestParameters )
                                        .ThenInclude( t => t.TestParameterMethod )
                                    .Include( s => s.SampleTestParameters ).ThenInclude( t => t.SampleTestParameterResults ).SingleAsync( s => s.Id == id );
        }



        /* TEST PARAMETERS */

        public async Task<List<SampleTestParameterModel>> GetSampleTestParameters(int sampleId)
        {
            return (await db.Samples.Include( s => s.SampleTestParameters ).ThenInclude( t => t.TestParameter ).Include( s => s.SampleTestParameters ).ThenInclude( t => t.Method ).SingleAsync( s => s.Id == sampleId )).SampleTestParameters;
        }

        public async Task<List<SampleTestParameterResultModel>> GetSampleTestParameterResults(int id)
        {
            List<SampleTestParameterResultModel> results = new List<SampleTestParameterResultModel>();
            foreach( SampleTestParameterModel testParameter in await GetSampleTestParameters(id) )
            {
                results.AddRange(testParameter.SampleTestParameterResults);
            }

            return results;
        }

        public async Task<SampleTestParameterResultModel> AddSampleTestResult(int sampleTestParameterId, string resultValue)
        {
            short revision = 0;
            var results = (await db.SampleTestParameters.Include( t => t.SampleTestParameterResults ).SingleAsync( t => t.Id == sampleTestParameterId )).SampleTestParameterResults;
            //results.Sort( (x, y) => { if(x.Revision < y.Revision) return -1; else if( x.Revision > y.Revision ) return 1; return 0; } );
            results.OrderBy( r => r.Revision );
            if(results.Count >= 1) revision = (short)(results.Last().Revision + 1);

            var result = new SampleTestParameterResultModel { Result = resultValue, Revision = revision, SampleTestParameterId = sampleTestParameterId, UserId = 1 };
            await db.SampleTestParameterResults.AddAsync(result);
            await db.SaveChangesAsync();

            //return revision;
            return result;
        }
    }
}