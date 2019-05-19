

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Transactions;

using AutoMapper;

using Lims.Models;
using Lims.BaseModels;
using Lims.TransferModels;
using Lims.Managers;
using Lims.ViewModels;

namespace Lims
{
    public class TestsController : Controller
    {
        private LimsContext Db;
        private TestsManager tests;
        private ILogger logger;
        public TestsController(LimsContext db, TestsManager tests, ILoggerFactory loggerFactory)
        {
            this.Db = db;
            this.tests = tests;
            this.logger = loggerFactory.CreateLogger("TestsController Log");
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("/Matrices/")]
        public async Task<IActionResult> GetMatrices()
        {
            return Json( await tests.GetMatrices() );
        }

        [HttpGet("/Methods/")]
        public async Task<IActionResult> GetMethods()
        {
            return Json( await tests.GetMethods() );
        }

        [HttpPost("/Methods/")]
        public async Task<IActionResult> AddMethod([FromBody]MethodModel method)
        {
            logger.LogWarning($"POST: Methods: MethodName: {method.Name}");
            return Json( await tests.SaveMethod(method) );
        }

        [HttpGet("Matrices/{id:int}/Tests")]
        public async Task<IActionResult> GetTestsByMatrixId(int id)
        {
            return Json(await tests.GetByMatrixId(id));
        }

        [HttpGet("[controller]/")]
        public async Task<IActionResult> GetAll()
        {
            return Json(await tests.GetTests());
        }

        [HttpGet("[controller]/{id:int}/")]
        public async Task<IActionResult> Get(int id)
        {
            return Json(await tests.GetByMatrixId(id));
        }

        [HttpPost("[controller]/")]
        public async Task<IActionResult> SaveTest([FromBody]TestTransferModel test)
        {

            // using ( var transaction = new TransactionScope( TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadCommitted } ) )
            // {
            //     try
            //     {
            //         logger.LogWarning($"{test == null}");
            //         logger.LogWarning($"TestName: {test.Name}, TestCode: {test.Code} , TestDescription: {test.Description}");
            //         var testModel = await tests.CreateTestAsync(test.Name, test.Code, test.Description);
            //         logger.LogWarning($"TestId: {testModel.Id}");
            //         await tests.AssignTestMatricesAsync(testModel, test.Matrices);
            //         logger.LogWarning($"Test Matrices Assigned");
            //         await tests.AssignTestMethodsAsync(testModel, Mapper.Map<List<TestParameterMethodBaseModel>, List<TestParameterMethodModel>>(test.Methods));
            //         logger.LogWarning($"Test Methods Assigned");

            //         transaction.Complete();

            //         return Json( (TestParameterBaseModel) testModel );
            //     }
            //     catch(Exception ex) { throw ex; }
            // }

            var transaction = await Db.Database.BeginTransactionAsync();
            try
            {
                logger.LogWarning($"{test == null}");
                logger.LogWarning($"TestName: {test.Name}, TestCode: {test.Code} , TestDescription: {test.Description}");
                var testModel = await tests.CreateTestAsync(test.Name, test.Code, test.Description);
                logger.LogWarning($"TestId: {testModel.Id}");
                await tests.AssignTestMatricesAsync(testModel, test.Matrices);
                logger.LogWarning($"Test Matrices Assigned");
                await tests.AssignTestMethodsAsync(testModel, Mapper.Map<List<TestParameterMethodBaseModel>, List<TestParameterMethodModel>>(test.Methods));
                logger.LogWarning($"Test Methods Assigned");

                transaction.Commit();

                return Json( (TestParameterBaseModel) testModel );
            }
            catch(Exception ex) { transaction.Rollback(); throw ex; }
        }

        [HttpGet("[controller]/{id:int}/methods")]
        public async Task<IActionResult> GetTestMethods(int id)
        {
            return Json(await tests.GetMethodsByTestParameterId(id));
        }

        [HttpGet("[controller]/{testId:int}/methods/{methodId:int}")]
        public async Task<IActionResult> GetTestMethod(int testId, int methodId)
        {
            return Json( Mapper.Map<TestParameterMethodModel, TestParameterMethodViewModel>(await tests.GetTestParameterMethod(testId, methodId)) );
        }
    }
}
